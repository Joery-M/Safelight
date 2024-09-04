import { syncRef, useElementBounding, useEventListener } from '@vueuse/core';
import EventEmitter from 'eventemitter3';
import {
    computed,
    nextTick,
    onBeforeUnmount,
    reactive,
    Ref,
    ref,
    shallowReactive,
    toRaw,
    watch
} from 'vue';
import { TimelineLayer } from './elements/TimelineLayer';
import { useSmoothNum } from './tools/useSmoothNum';

export function createTimelineManager(canvas: HTMLCanvasElement): CreateTimelineFn {
    const manager = new TimelineManager(canvas);

    return {
        manager,
        addElement(element: TimelineElement) {
            manager.timelineElements.add(element);
            if (element['init']) element.init(manager);
            manager.renderAll();
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
            console.log(layer.index.value);

            manager.layers.add(layer);
            layer.init(manager);

            manager.renderAll();
        }
    };
}

export interface CreateTimelineFn {
    manager: TimelineManager;
    addElement: (element: TimelineElement) => void;
    addLayer: (layer: TimelineLayer) => void;
}

export class TimelineManager {
    public timelineElements = shallowReactive(new Set<TimelineElement>());
    public layers = shallowReactive(new Set<TimelineLayer>());
    /**
     * Currently visible elements.
     *
     * Is assigned before rendering.
     */
    public visibleElements = new WeakSet<TimelineElement>();
    /**
     * Whether an extra render has already been queued
     */
    private renderingOnNextTick = false;

    /**
     * Current cursor for the user
     */
    public cursor = ref('auto');

    public events = new EventEmitter<TimelineEvents>();

    public viewport = reactive({
        /**
         * The left-most side of the timeline in milliseconds
         */
        start: 0,
        /**
         * The right-most side of the timeline in milliseconds
         */
        end: 1000
    });

    /**
     * How quickly the viewport transition to another state
     *
     * @example 1 = instant
     */
    public viewportSmoothing = ref(0.75);
    public viewportSmooth = {
        start: useSmoothNum(
            computed(() => this.viewport.start),
            { snapOffset: 0.01, stepPerc: this.viewportSmoothing }
        ),
        end: useSmoothNum(
            computed(() => this.viewport.end),
            { snapOffset: 0.01, stepPerc: this.viewportSmoothing }
        )
    };

    /* Public settings */
    public rightPadding = ref(1000);
    public leftBoundary = ref(0);
    public invertScrollAxes = ref(true);
    public invertVerticalScroll = ref(true);
    public invertHorizontalScroll = ref(true);
    public alignment = ref<TimelineAlignment>('bottom');
    public defaultLayerHeight = ref(32);

    /* Internal settings */
    public pointerOut = ref(true);
    private canvasHeight = ref(100);
    private canvasWidth = ref(100);
    public zoomFactor = ref(1);
    public startY = ref(0);
    public defaultLayerPaneWidth = ref(128);

    /* Computed */

    /**
     * Offset from left boundary of timeline in pixels
     */
    public offsetX = computed(() => this.msToPx(this.viewportSmooth.start.value));
    public maxWidth = computed(() => {
        // So the view doesn't snap when moving outside the max width, also use the current end as a max
        let maxRight = this.viewport.end - this.rightPadding.value;

        // for (const element of this.timelineElements) {
        //     if (element.type == 'layerItem' && 'end' in element && isRef(element.end)) {
        //         if ((parseFloat(element.end.value as any) || 0) > maxRight) {
        //             maxRight = parseFloat(element.end.value as any);
        //         }
        //     }
        // }
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
        useEventListener('pointerdown', (ev) => this.events.emit('mouseDown', this, ev, canvas));
        useEventListener('pointerup', (ev) => this.events.emit('mouseUp', this, ev, canvas));
        useEventListener('pointermove', (ev) => this.events.emit('mouseMove', this, ev, canvas));

        const bounds = useElementBounding(canvas);
        syncRef(bounds.width, this.canvasWidth, { direction: 'ltr' });
        syncRef(bounds.height, this.canvasHeight, { direction: 'ltr' });

        // Prevent browser zooming

        useEventListener(['mousemove', 'mouseenter', 'mouseover'], (ev) => {
            if (ev.target) {
                this.pointerOut.value = canvas !== ev.target;
            }
        });

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
                    const mouseX = ev.clientX - bounds.left.value;
                    const mouseXPerc = mouseX / bounds.width.value;
                    // Invert cause scrolling down should be zoom out
                    this.zoom(-ev.deltaY, mouseXPerc);
                } else {
                    // Scrolling
                    const shift = this.invertScrollAxes.value ? !ev.shiftKey : ev.shiftKey;
                    const invertY = this.invertVerticalScroll.value ? -1 : 1;
                    const invertX = this.invertHorizontalScroll.value ? -1 : 1;
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

        // Set user cursor
        watch(this.cursor, (cursor) => {
            canvas.style.cursor = cursor ?? 'auto';
        });

        // Render when any of these properties change
        watch(
            [
                this.canvasWidth,
                this.canvasHeight,
                this.rightPadding,
                this.viewportSmooth.start,
                this.viewportSmooth.end
            ],
            () => {
                this.renderAll();
            }
        );

        onBeforeUnmount(() => {
            this.events.emit('unmount', this);
            this.events.removeAllListeners();
        });

        // Import devtools
        if (import.meta.env.DEV) {
            import('./devtools/').then((dev) => {
                const unregister = dev.registerTimelineManager(this);
                this.events.once('unmount', unregister);
            });
        }
    }

    setCanvasProperties() {
        this.canvas.style.display = 'block';
    }

    renderAll = () => {
        this.canvas.width = this.canvasWidth.value;
        this.canvas.height = this.canvasHeight.value;

        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const layer of this.layers) {
            // Restore to last known settings before each render
            this.ctx.restore();
            // If called from event handler (v-on:click), `this` is a proxy
            layer.render(this.ctx, toRaw(this), false);
        }
        this.ctx.restore();

        for (const element of this.timelineElements) {
            this.ctx.restore();
            element.render(this.ctx, this, false);
        }
    };

    requestExtraRender = () => {
        if (!this.renderingOnNextTick) {
            nextTick(() => {
                this.renderingOnNextTick = false;
                this.renderAll();
            });
        }
        this.renderingOnNextTick = true;
    };

    /*
        ============    Viewport    ============

        Huge thanks to all the contributors of vue-devtools (v6), especially Guillaume Chau.
        This code is heavily inspired by (and copied from) the timeline implementation in vue-devtools:
        https://github.com/vuejs/devtools-v6/blob/79116147aef2a8957f8fd31b1f2dc67654686e1b/packages/app-frontend/src/features/timeline/Timeline.vue#L184-L206

        Even though the original code is written for Pixi (which i have considered using), it still works beautifully here.
    */

    pxToMs = (pixel: number) =>
        (pixel / this.canvasWidth.value) *
        (this.viewportSmooth.end.value - this.viewportSmooth.start.value);

    msToPx = (time: number) =>
        ((time - this.leftBoundary.value) /
            (this.viewportSmooth.end.value - this.viewportSmooth.start.value)) *
        this.canvasWidth.value;

    zoom = (delta: number, cursorPosition = 0.5) => {
        const size = this.viewport.end - this.viewport.start;

        const center = size * cursorPosition + this.viewport.start;

        let newSize = size - this.pxToMs(delta);
        if (newSize < 50) {
            newSize = 50;
        }

        let start = center - newSize * cursorPosition;
        let end = center + newSize * (1 - cursorPosition);
        if (start < this.leftBoundary.value) {
            start = this.leftBoundary.value;
            end = start + newSize;
        }

        // Add a bit of padding to the end
        if (end > this.maxWidth.value + this.rightPadding.value) {
            end = this.maxWidth.value + this.rightPadding.value;

            // Don't allow the start to go past the minTime
            if (start > this.leftBoundary.value) {
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

        const maxEnd = this.maxWidth.value + this.rightPadding.value;

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
            this.startY.value -= delta;
            if (this.startY.value < 0) {
                this.startY.value = 0;
            }

            const maxHeight =
                /* this.LayerToYPosition(this.highestLayer.value + 2, true, false, false) + */
                this.canvasHeight.value / 2;
            if (this.startY.value > maxHeight) {
                this.startY.value = maxHeight;
            }
        } else {
            this.startY.value += delta;
            if (this.startY.value < this.defaultLayerHeight.value * 2) {
                this.startY.value = this.defaultLayerHeight.value * 2;
            }

            const maxHeight =
                /* this.LayerToYPosition(this.highestLayer.value + 2, true, false, false) + */
                this.canvasHeight.value;
            if (this.startY.value > maxHeight) {
                this.startY.value = maxHeight;
            }
        }
    }
}

interface TimelineEvents {
    mouseDown: [manager: TimelineManager, ev: PointerEvent, canvas: HTMLCanvasElement];
    mouseUp: [manager: TimelineManager, ev: PointerEvent, canvas: HTMLCanvasElement];
    mouseMove: [manager: TimelineManager, ev: PointerEvent, canvas: HTMLCanvasElement];
    scroll: [manager: TimelineManager];
    pan: [manager: TimelineManager];
    unmount: [manager: TimelineManager];
}

export enum TimelineElementTypes {
    'generic',
    'layerItem',
    'layer'
}

export interface TimelineElement {
    type: TimelineElementTypes.generic;
    init?: (manager: TimelineManager) => any;
    render: (ctx: CanvasRenderingContext2D, manager: TimelineManager, isQueued: boolean) => any;
}

export interface TimelineItemElement {
    type: TimelineElementTypes.layerItem;
    start: Ref<number>;
    end: Ref<number>;
    init?: (layer: TimelineLayer) => any;
    render: (payload: {
        ctx: CanvasRenderingContext2D;
        layer: TimelineLayer;
        manager: TimelineManager;
        isQueued: boolean;
    }) => any;
}

export type TimelineAlignment = 'top' | 'bottom';
