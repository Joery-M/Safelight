import EventEmitter from 'eventemitter3';
import { computed, nextTick, onBeforeUnmount, reactive } from 'vue';

export function createTimelineManager(canvas: HTMLCanvasElement): CreateTimelineFn {
    const manager = new TimelineManager(canvas);

    return {
        manager,
        addElement(element: TimelineElement) {
            manager.timelineElements.add(element);
            if (element['init']) element.init(manager);
            manager.renderAll();
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

        onBeforeUnmount(() => {
            this.events.emit('unmount', this);
            this.events.removeAllListeners();

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
    }

    setCanvasProperties() {}

    renderAll(queued = false) {
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
            element.render(this.ctx, this, queued);
        }
    }

    requestExtraRender() {
        if (!this.renderingOnNextTick) {
            nextTick(() => {
                this.renderingOnNextTick = false;
                this.renderAll(true);
            });
        }
        this.renderingOnNextTick = true;
    }

    pxToMs(pixel: number) {
        return pixel;
    }
    msToPx(ms: number) {
        return ms;
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

export type TimelineElementTypes = 'generic' | 'layerItem' | 'layer';

export interface TimelineElement {
    type: TimelineElementTypes;
    init?: (manager: TimelineManager) => any;
    render: (ctx: CanvasRenderingContext2D, manager: TimelineManager, isQueued: boolean) => any;
}

export interface TimelineItemElement extends TimelineElement {
    start: number;
    end: number;
    layer: number;
}
