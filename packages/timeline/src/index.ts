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
        addElement(element) {
            manager.timelineElements.add(element);
            if (element['init']) element.init(manager);
        },
        removeElement(element) {
            return manager.timelineElements.delete(element);
        },
        hasElement(element) {
            return manager.timelineElements.has(element);
        },
        addLayer(layer) {
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
        },
        removeLayer(layer) {
            const success = manager.layers.delete(layer);
            if (!success) {
                return false;
            }

            // TODO: Re-organize layers to close gaps

            return true;
        },
        hasLayer(layer) {
            return manager.layers.has(layer);
        },
        addLayerItem(item) {
            manager.allLayerItems.add(item);
        },
        removeLayerItem(item) {
            return manager.allLayerItems.delete(item);
        },
        hasLayerItem(item) {
            return manager.allLayerItems.has(item);
        }
    };
}

export interface CreateTimelineFn {
    manager: TimelineManager;
    addElement: (element: TimelineElement) => void;
    removeElement: (element: TimelineElement) => boolean;
    hasElement: (element: TimelineElement) => boolean;
    addLayer: (layer: TimelineLayer) => void;
    removeLayer: (layer: TimelineLayer) => boolean;
    hasLayer: (layer: TimelineLayer) => boolean;
    addLayerItem: (item: TimelineItem) => void;
    removeLayerItem: (item: TimelineItem) => boolean;
    hasLayerItem: (item: TimelineItem) => boolean;
}

class ClearableWeakMap<K extends WeakKey = WeakKey, V = any> implements WeakMap<K, V> {
    private map: WeakMap<K, V>;
    get [Symbol.toStringTag]() {
        return this.map[Symbol.toStringTag];
    }

    constructor(entries?: readonly (readonly [K, V])[] | null) {
        this.map = new WeakMap<K, V>(entries);
    }

    delete(key: K): boolean {
        return this.map.delete(key);
    }
    get(key: K): V | undefined {
        return this.map.get(key);
    }
    has(key: K): boolean {
        return this.map.has(key);
    }
    set(key: K, value: V): this {
        this.map.set(key, value);
        return this;
    }

    clearEntries() {
        this.map = new WeakMap();
    }
}

export class TimelineManager {
    public __RENDER_TIME__ = ref(0);
    public __ELEMENT_RENDER_TIME = reactive(new ClearableWeakMap<TimelineElement, number>());
    private __FPS_LIST = reactive<number[]>([]);
    private __FPS__ = useRound(useAverage(this.__FPS_LIST));

    public timelineElements = shallowReactive(new Set<TimelineElement>());
    public allLayerItems = shallowReactive(new Set<TimelineItem>());
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
    public invertScrollAxes = ref(false);
    public invertVerticalScroll = ref(true);
    public invertHorizontalScroll = ref(true);
    public alignment = ref<TimelineAlignment>('bottom');
    public defaultLayerHeight = ref(32);
    public maxZoom = ref(300);
    public defaultLayerPaneWidth = ref(128);

    /* Internal settings */
    public pointerOut = ref(true);
    public canvasHeight = ref(100);
    public canvasWidth = ref(100);
    private windowDPI = useDevicePixelRatio().pixelRatio;
    private paneResizing = ref(false);
    public layerPaneWidth = ref(128);
    private changedLayerPaneWidth = ref(false);

    /* Computed */

    /**
     * Offset from left boundary of timeline in pixels
     */
    public viewportOffsetX = computed(() => this.msToPx(this.viewportSmooth.start.value));
    public maxViewWidth = computed(() => {
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
        Array.from(this.layers.values()).sort((a, b) => a.index.value - b.index.value)
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

        const getMouseData = (ev: MouseEvent | PointerEvent): MouseEventData => {
            const x = ev.clientX - bounds.left.value;
            const y = ev.clientY - bounds.top.value;
            const ms = this.pxToMs(x, true, true);
            const isInsideCanvas =
                x >= 0 && x < bounds.width.value && y >= 0 && y < bounds.height.value;

            const mouseY = this.canvasHeight.value - (y - this.viewportSmooth.yPos.value);

            let hoverLayerIndex = 0;
            {
                const maxText = 10000;
                while (hoverLayerIndex < maxText) {
                    const layerY = this.LayerToYPosition(hoverLayerIndex, false, true, false);
                    const nextLayerY = this.LayerToYPosition(hoverLayerIndex, true, true, false);
                    if (hoverLayerIndex == 0 && mouseY < layerY) {
                        break;
                    }
                    if (layerY >= mouseY && mouseY <= nextLayerY) {
                        break;
                    }
                    hoverLayerIndex++;
                }
                hoverLayerIndex--;
            }

            const hoverLayer = !isInsideCanvas
                ? undefined
                : this.layersSorted.value[hoverLayerIndex];

            return Object.freeze<MouseEventData>({
                ms,
                x,
                y,
                isInsideCanvas,
                hoverLayerIndex,
                hoverLayer
            });
        };
        useEventListener('pointerdown', (ev) => {
            if (!this.pointerOut.value) {
                ev.preventDefault();
            }
            this.events.emit('mouseDown', {
                ev: ev,
                manager: this,
                mouseData: getMouseData(ev),
                canvas
            });
        });
        useEventListener('pointerup', (ev) => {
            if (!this.pointerOut.value) {
                ev.preventDefault();
            }
            this.events.emit('mouseUp', {
                ev: ev,
                manager: this,
                mouseData: getMouseData(ev),
                canvas
            });
        });
        useEventListener('pointermove', (ev) => {
            if (!this.pointerOut.value) {
                ev.preventDefault();
            }
            this.events.emit('mouseMove', {
                ev: ev,
                manager: this,
                mouseData: getMouseData(ev),
                canvas
            });
        });
        useEventListener(canvas, 'click', (ev) => {
            this.events.emit('mouseClick', {
                ev: ev,
                manager: this,
                mouseData: getMouseData(ev),
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

        watch(
            [this.viewportSmooth.start, this.viewportSmooth.end, this.viewportSmooth.yPos],
            () => {
                this.events.emit('pan', this);
            }
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
                            this.cursor.delete('layerPane');
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
            if (__DEVTOOLS_AVAILABLE__.value) {
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

        this.__ELEMENT_RENDER_TIME.clearEntries();
        this.ctx.font = 'normal 14px "Inter Variable"';
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const element of this.timelineElements) {
            if (element.renderStep == 'before') {
                if (__DEVTOOLS_AVAILABLE__.value) {
                    const start = performance.now();
                    element.render({ ctx: this.ctx, manager: this, isQueued: false });
                    const end = performance.now();
                    this.__ELEMENT_RENDER_TIME.set(element, end - start);
                } else {
                    element.render({ ctx: this.ctx, manager: this, isQueued: false });
                }
            }
        }

        for (const layer of this.layers) {
            // If in dev mode, save render time
            if (__DEVTOOLS_AVAILABLE__.value) {
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
                if (__DEVTOOLS_AVAILABLE__.value) {
                    const start = performance.now();
                    element.render({ ctx: this.ctx, manager: this, isQueued: false });
                    const end = performance.now();
                    this.__ELEMENT_RENDER_TIME.set(element, end - start);
                } else {
                    element.render({ ctx: this.ctx, manager: this, isQueued: false });
                }
            }
        }

        // Relying on all uses of ctx.save to also use ctx.restore
        this.ctx.restore();
    }

    /*
        ============    Viewport    ============

        Huge thanks to all the contributors of vue-devtools (v6), especially Guillaume Chau.
        This code is heavily inspired by (and copied from) the timeline implementation in vue-devtools:
        https://github.com/vuejs/devtools-v6/blob/79116147aef2a8957f8fd31b1f2dc67654686e1b/packages/app-frontend/src/features/timeline/Timeline.vue#L184-L206

        Even though the original code is written for Pixi (which i have considered using), it still works beautifully here.
    */

    pxToMs(pixel: number, offset = false, layerPane = false) {
        if (offset) pixel += this.viewportOffsetX.value;
        if (layerPane) pixel -= this.layerPaneWidth.value;

        return (
            (pixel / (this.canvasWidth.value - this.layerPaneWidth.value)) *
            (this.viewportSmooth.end.value - this.viewportSmooth.start.value)
        );
    }

    msToPx(time: number, offset = false, layerPane = false) {
        if (offset) time -= this.viewportSmooth.start.value;

        let res =
            ((time - this.leftBoundary.value) /
                (this.viewportSmooth.end.value - this.viewportSmooth.start.value)) *
            (this.canvasWidth.value - this.layerPaneWidth.value);

        if (layerPane) res += this.layerPaneWidth.value;
        return res;
    }

    LayerToYPosition(
        layer: number,
        includeCurrent = false,
        includeOffset = false,
        useAlignment = true
    ) {
        const currentHeight = this.layerHeights.value[layer] ?? this.defaultLayerHeight.value;
        let totalHeight = includeCurrent ? currentHeight : 0;
        for (let i = 0; i < layer; i++) {
            const curHeight = this.layerHeights.value[i] ?? this.defaultLayerHeight.value;
            totalHeight += curHeight + 1;
        }

        if (includeOffset) {
            totalHeight += includeOffset ? -this.viewportSmooth.yPos.value : 0;
        }

        if (this.alignment.value == 'bottom' && useAlignment) {
            return this.canvasHeight.value - totalHeight - currentHeight;
        } else {
            return totalHeight;
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
        if (end > this.maxViewWidth.value + this.rightPadding.value) {
            end = this.maxViewWidth.value + this.rightPadding.value;

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

        const maxEnd = this.maxViewWidth.value + this.rightPadding.value;

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
        delta /= 2;
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
                    value: this.viewportOffsetX.value,
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
                    value: this.maxViewWidth.value,
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
    mouseDown: [payload: MouseEventPayload];
    mouseUp: [payload: MouseEventPayload];
    mouseMove: [payload: MouseEventPayload];
    mouseClick: [payload: MouseEventPayload<true>];
    zoom: [manager: TimelineManager];
    pan: [manager: TimelineManager];
    unmount: [manager: TimelineManager];
}

export interface MouseEventData {
    x: number;
    y: number;
    ms: number;
    isInsideCanvas: boolean;
    hoverLayerIndex: number;
    hoverLayer?: TimelineLayer;
}

export interface MouseEventPayload<isClick = false> {
    ev: isClick extends true ? MouseEvent : PointerEvent;
    manager: TimelineManager;
    mouseData: MouseEventData;
    canvas: HTMLCanvasElement;
}

export interface TimelineElement {
    name: string;
    /**
     * Render this element before or after rendering layers and their items
     */
    renderStep?: 'before' | 'after';
    init?: (manager: TimelineManager) => any;
    render: (payload: TimelineElementRenderPayload) => any;

    devtoolsState?: () => CustomInspectorState;
}

export interface TimelineItem {
    layer: Ref<number>;
    start: Ref<number>;
    end: Ref<number>;
    init?: (payload: TimelineItemInitPayload) => any;
    render: (payload: TimelineItemRenderPayload) => any;
    devtoolsState?: () => CustomInspectorState;
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

export interface TimelineElementRenderPayload {
    ctx: CanvasRenderingContext2D;
    manager: TimelineManager;
    isQueued: boolean;
}
export interface TimelineItemRenderPayload {
    ctx: CanvasRenderingContext2D;
    layer: TimelineLayer;
    manager: TimelineManager;
    isQueued: boolean;
    container: Readonly<ItemContainer>;
}
export interface TimelineItemInitPayload {
    layer: TimelineLayer;
    manager: TimelineManager;
}
