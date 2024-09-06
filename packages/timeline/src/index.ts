import { CustomInspectorState } from '@vue/devtools-api';
import { syncRef, useDevicePixelRatio, useElementBounding, useEventListener } from '@vueuse/core';
import { useAverage, useRound } from '@vueuse/math';
import EventEmitter from 'eventemitter3';
import {
    computed,
    onBeforeUnmount,
    reactive,
    Ref,
    ref,
    shallowReactive,
    toRaw,
    watch,
    watchEffect
} from 'vue';
import { TimelineLayer } from './elements/TimelineLayer';
import { canvasRestore, canvasSave } from './tools/canvasState';
import { useSmoothNum } from './tools/useSmoothNum';

/**
 * DONT USE
 *
 * Automatically set whenever devtools has been installed
 */
export const __DEVTOOLS_AVAILABLE__ = ref(false);

export function createTimelineManager(canvas: HTMLCanvasElement): CreateTimelineFn {
    const manager = new TimelineManager(canvas);

    return {
        manager,
        addElement(element: TimelineElement) {
            manager.timelineElements.add(element);
            if (element['init']) element.init(manager);
        },
        addLayer(layer: TimelineLayer) {
            let maxIndex = 0;
            let indexTaken = false;
            manager.layers.forEach((l) => {
                if (layer.index.value == l.index.value) {
                    indexTaken = true;
                }
                if (l.index.value > maxIndex) maxIndex = l.index.value;
            });
            if (indexTaken) {
                layer.index.value = maxIndex + 1;
            }

            manager.layers.add(layer);
            layer.init(manager);
        }
    };
}

export interface CreateTimelineFn {
    manager: TimelineManager;
    addElement: (element: TimelineElement) => void;
    addLayer: (layer: TimelineLayer) => void;
}

export class TimelineManager {
    public __RENDER_TIME__ = ref(0);
    private __FPS_LIST = reactive<number[]>([]);
    public __FPS__ = useRound(useAverage(this.__FPS_LIST));

    public timelineElements = shallowReactive(new Set<TimelineElement>());
    public layers = shallowReactive(new Set<TimelineLayer>());
    /**
     * Currently visible elements.
     *
     * Is assigned before rendering.
     */
    public visibleElements = new WeakSet<TimelineElement>();

    /**
     * Current cursor for the user
     */
    public cursor = reactive(new Map<string, [string, number]>());
    private curCursor = ref('auto');

    public events = new EventEmitter<TimelineEvents>();

    public viewport = reactive({
        /**
         * The left-most side of the timeline in milliseconds
         */
        start: 0,
        /**
         * The right-most side of the timeline in milliseconds
         */
        end: 1000,
        /**
         * The Y offset
         */
        yPos: 0
    });

    /**
     * How quickly the viewport transitions to another state
     *
     * @example 1 = instant
     */
    public viewportSmoothingX = ref(0.5);
    public viewportSmoothingY = ref(0.5);
    public viewportSmooth = {
        start: useSmoothNum(
            computed(() => this.viewport.start),
            { snapOffset: 0.01, stepPerc: this.viewportSmoothingX }
        ),
        end: useSmoothNum(
            computed(() => this.viewport.end),
            { snapOffset: 0.01, stepPerc: this.viewportSmoothingX }
        ),
        yPos: useSmoothNum(
            computed(() => this.viewport.yPos),
            { snapOffset: 0.01, stepPerc: this.viewportSmoothingY }
        )
    };

    /* Public settings */
    public rightPadding = ref(5000);
    public leftBoundary = ref(0);
    public invertScrollAxes = ref(true);
    public invertVerticalScroll = ref(true);
    public invertHorizontalScroll = ref(true);
    public alignment = ref<TimelineAlignment>('bottom');
    public defaultLayerHeight = ref(32);
    public maxZoom = ref(300);

    /* Internal settings */
    public pointerOut = ref(true);
    private canvasHeight = ref(100);
    private canvasWidth = ref(100);
    private paneResizing = ref(false);
    public windowDPI = useDevicePixelRatio().pixelRatio;
    public defaultLayerPaneWidth = ref(128);
    public layerPaneWidth = ref(128);
    /**
     * Change the speed of vertical scrolling
     */
    // Magic number, lets goooo
    private constantYScale = 0.5;
    private changedLayerPaneWidth = ref(false);

    /* Computed */

    /**
     * Offset from left boundary of timeline in pixels
     */
    public _offsetX = computed(() => this.msToPx(this.viewportSmooth.start.value));
    public _maxWidth = computed(() => {
        // So the view doesn't snap when moving outside the max width, also use the current end as a max
        let maxRight = this.viewport.end - this.rightPadding.value;

        for (const layer of this.layers) {
            if (layer.maxEnd.value > maxRight) {
                maxRight = layer.maxEnd.value;
            }
        }

        return maxRight;
    });

    public layersSorted = computed(() =>
        Array.from(this.layers.values()).sort((a, b) => b.index.value - a.index.value)
    );

    private layerHeights = computed(() => this.layersSorted.value.map((l) => l.height.value));

    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = context;
        this.setCanvasProperties();

        /* 
            ----- Listen to user events ------
        */
        useEventListener('pointerdown', (ev) => {
            if (!this.pointerOut.value) {
                ev.preventDefault();
            }
            const x = ev.clientX - bounds.left.value;
            const y = ev.clientY - bounds.top.value;
            const ms = this.pxToMs(x);
            this.events.emit('mouseDown', {
                ev: ev,
                manager: this,
                mouseData: Object.freeze({ ms, x, y }),
                canvas
            });
        });
        useEventListener('pointerup', (ev) => {
            if (!this.pointerOut.value) {
                ev.preventDefault();
            }
            const x = ev.clientX - bounds.left.value;
            const y = ev.clientY - bounds.top.value;
            const ms = this.pxToMs(x);
            this.events.emit('mouseUp', {
                ev: ev,
                manager: this,
                mouseData: Object.freeze({ ms, x, y }),
                canvas
            });
        });
        useEventListener('pointermove', (ev) => {
            if (!this.pointerOut.value) {
                ev.preventDefault();
            }
            const x = ev.clientX - bounds.left.value;
            const y = ev.clientY - bounds.top.value;
            const ms = this.pxToMs(x);
            this.events.emit('mouseMove', {
                ev: ev,
                manager: this,
                mouseData: Object.freeze({ ms, x, y }),
                canvas
            });
        });
        useEventListener(canvas, 'click', (ev) => {
            const x = ev.clientX - bounds.left.value;
            const y = ev.clientY - bounds.top.value;
            const ms = this.pxToMs(x);
            this.events.emit('mouseClick', {
                ev: ev,
                manager: this,
                mouseData: Object.freeze({ ms, x, y }),
                canvas
            });
        });

        const bounds = useElementBounding(canvas);
        syncRef(bounds.width, this.canvasWidth, { direction: 'ltr' });
        syncRef(bounds.height, this.canvasHeight, { direction: 'ltr' });

        // Prevent browser zooming
        useEventListener(
            canvas,
            ['pointerover', 'pointerleave', 'pointerout', 'pointerenter', 'pointermove'],
            (ev) => {
                this.pointerOut.value = ev.type == 'pointerleave' || ev.type == 'pointerout';
            }
        );

        // Mouse wheel zoom and pan
        useEventListener(
            'wheel',
            (ev) => {
                if (!this.pointerOut.value) {
                    ev.preventDefault();
                } else {
                    return;
                }

                if (ev.ctrlKey) {
                    // Zooming
                    let mouseX = ev.clientX - bounds.left.value - this.layerPaneWidth.value;
                    if (mouseX < 0) {
                        mouseX = 0;
                    }
                    const mouseXPerc = mouseX / (bounds.width.value - this.layerPaneWidth.value);
                    // Invert cause scrolling down should be zoom out
                    this.zoom(-ev.deltaY, mouseXPerc);
                } else {
                    // Scrolling
                    const shift = this.invertScrollAxes.value ? !ev.shiftKey : ev.shiftKey;
                    const invertY = this.invertVerticalScroll.value ? 1 : -1;
                    const invertX = this.invertHorizontalScroll.value ? 1 : -1;
                    if (shift) {
                        this.moveY(ev.deltaY * invertY);
                        this.move(ev.deltaX * invertX);
                    } else {
                        this.moveY(ev.deltaX * invertY);
                        this.move(ev.deltaY * invertX);
                    }
                }
            },
            { passive: false }
        );

        watch(this.defaultLayerPaneWidth, () => {
            if (!this.changedLayerPaneWidth.value) {
                this.layerPaneWidth.value = this.defaultLayerPaneWidth.value;
            }
        });

        // Listen to mouse, and set cursor for layer pane resize handle
        {
            let paneResizeXStart = 0;
            let startSize = this.layerPaneWidth.value;
            let requestedSize = 0;
            let lastClick = 0;
            this.events.on('mouseMove', ({ mouseData: { x } }) => {
                const distToHandle = x - startSize;
                if (Math.abs(distToHandle) < 2 || this.paneResizing.value) {
                    this.cursor.set('layerPane', ['col-resize', 5]);
                } else {
                    this.cursor.delete('layerPane');
                }
                if (this.paneResizing.value) {
                    const offset = distToHandle - paneResizeXStart;
                    requestedSize = startSize + offset;

                    this.layerPaneWidth.value = Math.max(requestedSize, 2);
                    this.layerPaneWidth.value = Math.min(
                        this.layerPaneWidth.value,
                        this.canvasWidth.value - 100
                    );
                }
            });
            this.events.on('mouseDown', ({ mouseData: { x } }) => {
                if (!this.pointerOut.value) {
                    const distToHandle = x - this.layerPaneWidth.value;
                    if (Math.abs(distToHandle) < 2) {
                        paneResizeXStart = distToHandle;
                        startSize = this.layerPaneWidth.value;
                        this.paneResizing.value = true;
                    }
                }
            });
            this.events.on('mouseUp', () => {
                if (this.paneResizing.value) {
                    startSize = this.layerPaneWidth.value;
                    this.paneResizing.value = false;

                    this.changedLayerPaneWidth.value = true;
                }
            });
            this.events.on('mouseClick', ({ mouseData: { x } }) => {
                if (!this.pointerOut.value) {
                    const distToHandle = x - this.layerPaneWidth.value;
                    if (Math.abs(distToHandle) < 2) {
                        if (Date.now() - lastClick < 500) {
                            this.layerPaneWidth.value = this.defaultLayerPaneWidth.value;
                            requestedSize = this.defaultLayerPaneWidth.value;
                            startSize = this.defaultLayerPaneWidth.value;
                            lastClick = 0;
                        } else {
                            lastClick = Date.now();
                        }
                    }
                }
            });
        }

        // Set user cursor
        watch(this.cursor, (cursorMap) => {
            this.curCursor.value = 'auto';
            canvas.style.cursor = 'auto';
            const cursors = Array.from(cursorMap.entries()).sort(
                ([_kA, [_cA, a]], [_kB, [_cB, b]]) => b - a
            );

            for (const [_s, [cursor]] of cursors) {
                if (cursor && cursor !== 'auto') {
                    canvas.style.cursor = cursor ?? 'auto';
                    this.curCursor.value = cursor ?? 'auto';
                    break;
                }
            }
        });

        watchEffect(() => {
            if (import.meta.env.DEV) {
                const start = performance.now();
                this.renderAll();
                const end = performance.now();
                this.__FPS_LIST.push(1000 / (end - start));
                this.__RENDER_TIME__.value = end - start;
                while (this.__FPS_LIST.length > 100) {
                    this.__FPS_LIST.shift();
                }
            } else {
                this.renderAll();
            }
        });

        onBeforeUnmount(() => {
            this.events.emit('unmount', this);
            this.events.removeAllListeners();
        });

        // Import devtools
        watch(
            __DEVTOOLS_AVAILABLE__,
            (enable) => {
                if (enable) {
                    import('./devtools/').then((dev) => {
                        if (dev.registerTimelineManager) {
                            const unregister = dev.registerTimelineManager(this);
                            this.events.once('unmount', unregister);
                        }
                    });
                }
            },
            { immediate: true }
        );
    }

    setCanvasProperties() {
        this.canvas.style.display = 'block';
    }

    renderAll() {
        if (this.canvasWidth.value !== 0 && this.canvasHeight.value !== 0) {
            this.canvas.width = this.canvasWidth.value * this.windowDPI.value;
            this.canvas.height = this.canvasHeight.value * this.windowDPI.value;
            this.ctx.scale(this.windowDPI.value, this.windowDPI.value);
        }

        this.ctx.font = 'normal 14px "Inter Variable"';
        const canvasState = canvasSave(this.ctx);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const element of this.timelineElements) {
            if (element.renderStep == 'before') {
                canvasRestore(this.ctx, canvasState);
                element.render({ ctx: this.ctx, manager: this, isQueued: false });
            }
        }

        for (const layer of this.layers) {
            // Restore to last known settings before each render
            canvasRestore(this.ctx, canvasState);

            // If in dev mode, save render time
            if (import.meta.env.DEV) {
                const start = performance.now();
                layer.render(this.ctx, this);
                const end = performance.now();
                layer.__RENDER_TIME__.value = end - start;
            } else {
                layer.render(this.ctx, this);
            }
        }

        for (const element of this.timelineElements) {
            if (element.renderStep !== 'before') {
                canvasRestore(this.ctx, canvasState);
                element.render({ ctx: this.ctx, manager: this, isQueued: false });
            }
        }
    }

    /*
        ============    Viewport    ============

        Huge thanks to all the contributors of vue-devtools (v6), especially Guillaume Chau.
        This code is heavily inspired by (and copied from) the timeline implementation in vue-devtools:
        https://github.com/vuejs/devtools-v6/blob/79116147aef2a8957f8fd31b1f2dc67654686e1b/packages/app-frontend/src/features/timeline/Timeline.vue#L184-L206

        Even though the original code is written for Pixi (which i have considered using), it still works beautifully here.
    */

    pxToMs = (pixel: number) =>
        (pixel / (this.canvasWidth.value - this.layerPaneWidth.value)) *
        (this.viewportSmooth.end.value - this.viewportSmooth.start.value);

    msToPx = (time: number) =>
        ((time - this.leftBoundary.value) /
            (this.viewportSmooth.end.value - this.viewportSmooth.start.value)) *
        (this.canvasWidth.value - this.layerPaneWidth.value);

    LayerToYPosition(
        layer: number,
        includeCurrent = false,
        includeOffset = false,
        useAlignment = true
    ) {
        const currentHeight = this.layerHeights.value[layer];
        let totalHeight = includeCurrent ? currentHeight : 0;
        for (let i = 0; i < layer; i++) {
            const curHeight = this.layerHeights.value[i] ?? this.defaultLayerHeight;
            totalHeight += curHeight + 1;
        }

        const offset =
            totalHeight +
            (includeOffset ? -this.viewportSmooth.yPos.value * this.constantYScale : 0);

        if (this.alignment.value == 'bottom' && useAlignment) {
            return this.canvasHeight.value - offset - currentHeight;
        } else {
            return offset;
        }
    }

    zoom = (delta: number, cursorPosition = 0.5) => {
        const size = this.viewport.end - this.viewport.start;

        const center = size * cursorPosition + this.viewport.start;

        let newSize = size - this.pxToMs(delta);
        if (newSize < this.maxZoom.value) {
            newSize = this.maxZoom.value;
        }

        let start = center - newSize * cursorPosition;
        let end = center + newSize * (1 - cursorPosition);
        if (start < this.leftBoundary.value) {
            start = this.leftBoundary.value;
            end = start + newSize;
        }

        // Add a bit of padding to the end
        if (end > this._maxWidth.value + this.rightPadding.value) {
            end = this._maxWidth.value + this.rightPadding.value;

            // Don't allow the start to go past the minTime
            if (start < this.leftBoundary.value) {
                start = this.leftBoundary.value;
            }
        }
        this.viewport.start = start;
        this.viewport.end = end;
    };

    move(delta: number) {
        const size = this.viewport.end - this.viewport.start;
        let start = this.viewport.start + (delta / this.canvasWidth.value) * size;
        let end = start + size;

        const maxEnd = this._maxWidth.value + this.rightPadding.value;

        // Add a bit of padding to the end
        if (end > maxEnd) {
            end = maxEnd;
            start = end - size;
        }

        if (start < this.leftBoundary.value) {
            start = this.leftBoundary.value;
            end = start + size;
        }

        if (end > maxEnd && start < this.leftBoundary.value) {
            start = this.leftBoundary.value;
            end = start + maxEnd;
        }

        this.viewport.start = start;
        this.viewport.end = end;
    }

    moveY(delta: number) {
        if (this.alignment.value == 'bottom') {
            this.viewport.yPos -= delta;
            if (this.viewport.yPos < 0) {
                this.viewport.yPos = 0;
            }

            const maxHeight =
                this.LayerToYPosition(this.layers.size + 2, true, false, false) +
                this.canvasHeight.value / 2;
            if (this.viewport.yPos > maxHeight) {
                this.viewport.yPos = maxHeight;
            }
        } else {
            this.viewport.yPos += delta;
            if (this.viewport.yPos < this.defaultLayerHeight.value * 2) {
                this.viewport.yPos = this.defaultLayerHeight.value * 2;
            }

            const maxHeight =
                this.LayerToYPosition(this.layers.size + 2, true, false, false) +
                this.canvasHeight.value;
            if (this.viewport.yPos > maxHeight) {
                this.viewport.yPos = maxHeight;
            }
        }
    }

    public _devtools_get_state = (): CustomInspectorState => {
        return {
            viewport: [
                {
                    key: 'view',
                    value: toRaw(this.viewport ?? {}),
                    objectType: 'reactive',
                    editable: true
                },
                {
                    key: 'X offset',
                    value: this._offsetX.value,
                    objectType: 'reactive',
                    editable: true
                },
                {
                    key: 'Pointer inside canvas',
                    value: !this.pointerOut.value,
                    objectType: 'computed',
                    editable: false
                },
                {
                    key: 'Smoothing',
                    value: {
                        x: this.viewportSmoothingX.value,
                        y: this.viewportSmoothingY.value
                    },
                    objectType: 'computed',
                    editable: false
                }
            ],
            items: [
                {
                    key: 'Items end',
                    value: this._maxWidth.value,
                    objectType: 'computed'
                }
            ],
            rendering: [
                {
                    key: 'Render time (ms)',
                    value: this.__RENDER_TIME__.value
                },
                {
                    key: 'FPS',
                    value: this.__FPS__.value
                }
            ],
            interaction: [
                {
                    key: 'Current cursor',
                    value: this.canvas.style.cursor
                },
                {
                    key: 'Cursor map',
                    value: Object.fromEntries(
                        Array.from(this.cursor.entries())
                            .sort(([_kA, [_cA, a]], [_kB, [_cB, b]]) => b - a)
                            .map(([key, [cursor, prio]]) => [`${key} (${prio})`, cursor])
                    )
                }
            ]
        };
    };
}

interface TimelineEvents {
    mouseDown: [
        payload: {
            ev: PointerEvent;
            manager: TimelineManager;
            mouseData: MouseEventData;
            canvas: HTMLCanvasElement;
        }
    ];
    mouseUp: [
        payload: {
            ev: PointerEvent;
            manager: TimelineManager;
            mouseData: MouseEventData;
            canvas: HTMLCanvasElement;
        }
    ];
    mouseMove: [
        payload: {
            ev: PointerEvent;
            manager: TimelineManager;
            mouseData: MouseEventData;
            canvas: HTMLCanvasElement;
        }
    ];
    mouseClick: [
        payload: {
            ev: MouseEvent;
            manager: TimelineManager;
            mouseData: MouseEventData;
            canvas: HTMLCanvasElement;
        }
    ];
    scroll: [manager: TimelineManager];
    pan: [manager: TimelineManager];
    unmount: [manager: TimelineManager];
}

export interface MouseEventData {
    x: number;
    y: number;
    ms: number;
}

export interface TimelineElement {
    name: string;
    /**
     * Render this element before or after rendering layers and their items
     */
    renderStep?: 'before' | 'after';
    init?: (manager: TimelineManager) => any;
    render: (payload: {
        ctx: CanvasRenderingContext2D;
        manager: TimelineManager;
        isQueued: boolean;
    }) => any;

    devtoolsState?: () => CustomInspectorState;
}

export interface TimelineItemElement {
    start: Ref<number>;
    end: Ref<number>;
    init?: (layer: TimelineLayer) => any;
    render: (payload: {
        ctx: CanvasRenderingContext2D;
        layer: TimelineLayer;
        manager: TimelineManager;
        isQueued: boolean;
        container: Readonly<ItemContainer>;
    }) => any;
}

export type TimelineAlignment = 'top' | 'bottom';

export interface ItemContainer {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}
