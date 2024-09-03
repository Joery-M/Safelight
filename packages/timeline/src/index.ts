import EventEmitter from 'eventemitter3';
import { computed, nextTick, onBeforeUnmount, reactive, Ref, ref, toRaw, watch } from 'vue';
import { useSmoothNum } from './tools/useSmoothNum';

export function createTimelineManager(canvas: HTMLCanvasElement): CreateTimelineFn {
    const manager = new TimelineManager(canvas);

    return {
        manager,
        addElement(element: TimelineElement) {
            manager.timelineElements.add(element);
            if (element['init']) element.init(manager);
            manager.requestExtraRender();
        }
    };
}

export interface CreateTimelineFn {
    manager: TimelineManager;
    addElement: (element: TimelineElement) => void;
}

export class TimelineManager {
    public timelineElements = new Set<TimelineElement>();
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
    public viewportSmooth = {
        start: useSmoothNum(
            computed(() => this.viewport.start),
            { snapOffset: 0.01 }
        ),
        end: useSmoothNum(
            computed(() => this.viewport.end),
            { snapOffset: 0.01 }
        )
    };

    public rightPadding = ref(1000);
    public leftBoundary = ref(0);
    public rightBoundary = ref(1000);

    private canvasHeight = ref(100);
    private canvasWidth = ref(100);
    public zoomFactor = ref(1);

    /* Computed */

    /**
     * Offset from left boundary of timeline in pixels
     */
    public offsetX = computed(() => this.msToPx(this.viewportSmooth.start.value));

    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = context;
        this.setCanvasProperties();

        const mouseDownEv = (ev: PointerEvent) => {
            this.events.emit('mouseDown', this, ev, canvas);
        };
        canvas.addEventListener('pointerdown', mouseDownEv);

        const mouseUpEv = (ev: PointerEvent) => {
            this.events.emit('mouseUp', this, ev, canvas);
        };
        canvas.addEventListener('pointerup', mouseUpEv);

        const mouseMoveEv = (ev: PointerEvent) => {
            this.events.emit('mouseMove', this, ev, canvas);
        };
        canvas.addEventListener('pointermove', mouseMoveEv);

        const resizeObserver = new ResizeObserver(() => {
            this.canvasWidth.value = canvas.clientWidth;
            this.canvasHeight.value = canvas.clientHeight;
        });
        resizeObserver.observe(canvas);

        watch(this.cursor, (cursor) => {
            canvas.style.cursor = cursor ?? 'auto';
        });

        watch(
            [
                this.canvasWidth,
                this.canvasHeight,
                this.rightPadding,
                this.viewportSmooth.start,
                this.viewportSmooth.end
            ],
            () => {
                this.requestExtraRender();
            }
        );

        onBeforeUnmount(() => {
            this.events.emit('unmount', this);
            this.events.removeAllListeners();
            resizeObserver.disconnect();

            canvas.removeEventListener('pointerdown', mouseDownEv);
            canvas.removeEventListener('pointerup', mouseUpEv);
            canvas.removeEventListener('pointermove', mouseMoveEv);
        });

        if (import.meta.env.DEV) {
            import('./devtools/').then((dev) => {
                const unregister = dev.registerTimelineManager(this);
                this.events.once('unmount', unregister);
            });
        }

        // const speed = 0.5;
        // useRafFn(() => {
        //     const dist = this.viewport.start - this.viewportSmooth.start;

        //     // When offset is less than 0.1 pixels, just go right to the end
        //     if (Math.abs(this.msToPx(dist)) < 0.1) {
        //         this.viewportSmooth.start = this.viewport.start;
        //         return;
        //     }

        //     this.viewportSmooth.start = this.viewportSmooth.start + dist * speed;
        // });
        // useRafFn(() => {
        //     const dist = this.viewport.end - this.viewportSmooth.end;

        //     // When offset is less than 0.1 pixels, just go right to the end
        //     if (Math.abs(this.msToPx(dist)) < 0.1) {
        //         this.viewportSmooth.end = this.viewport.end;
        //         return;
        //     }

        //     this.viewportSmooth.end = this.viewportSmooth.end + dist * speed;
        // });
    }

    setCanvasProperties() {
        this.canvas.style.display = 'block';
    }

    renderAll = (queued = false) => {
        this.canvas.width = this.canvasWidth.value;
        this.canvas.height = this.canvasHeight.value;
        // this.ctx.fillText(Date.now().toString(), 0, 0);
        this.ctx.fillStyle = 'white';
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const element of this.timelineElements) {
            if (element.type == 'layerItem') {
                // TODO: Check if item is in view
                this.visibleElements.add(element);
            } else {
                this.visibleElements.add(element);
            }

            // Restore to last known settings before each render
            this.ctx.restore();
            // If called from event handler (v-on:click), `this` is a proxy
            element.render(this.ctx, toRaw(this), queued);
        }
    };

    requestExtraRender = () => {
        if (!this.renderingOnNextTick) {
            nextTick(() => {
                this.renderingOnNextTick = false;
                this.renderAll(true);
            });
        }
        this.renderingOnNextTick = true;
    };

    /* Viewport */

    pxToMs = (pixel: number) => {
        return (
            (pixel / this.canvasWidth.value) *
            (this.viewportSmooth.end.value - this.viewportSmooth.start.value)
        );
    };
    msToPx = (time: number) => {
        return (
            ((time - this.leftBoundary.value) /
                (this.viewportSmooth.end.value - this.viewportSmooth.start.value)) *
            this.canvasWidth.value
        );
    };

    zoom = (deltaInv: number, cursorPosition = 0.5) => {
        const delta = deltaInv * -1;

        const size = this.viewport.end - this.viewport.start;

        const center = size * cursorPosition + this.viewport.start;

        let newSize = size + (delta / this.canvasWidth.value) * size * this.zoomFactor.value;
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
        if (end > this.rightBoundary.value + this.rightPadding.value) {
            end = this.rightBoundary.value + this.rightPadding.value;

            // Don't allow the start to go past the minTime
            if (start > this.leftBoundary.value) {
                start = end - newSize;
            }
        }
        this.viewport.start = start;
        this.viewport.end = end;
    };
}

interface TimelineEvents {
    mouseDown: [manager: TimelineManager, ev: PointerEvent, canvas: HTMLCanvasElement];
    mouseUp: [manager: TimelineManager, ev: PointerEvent, canvas: HTMLCanvasElement];
    mouseMove: [manager: TimelineManager, ev: PointerEvent, canvas: HTMLCanvasElement];
    scroll: [manager: TimelineManager];
    pan: [manager: TimelineManager];
    unmount: [manager: TimelineManager];
}

export type TimelineElementTypes = 'generic' | 'layerItem' | 'layer';

export interface TimelineElement {
    type: TimelineElementTypes;
    init?: (manager: TimelineManager) => any;
    render: (ctx: CanvasRenderingContext2D, manager: TimelineManager, isQueued: boolean) => any;
}

export interface TimelineItemElement extends TimelineElement {
    start: Ref<number>;
    end: Ref<number>;
    layer: Ref<number>;
}
