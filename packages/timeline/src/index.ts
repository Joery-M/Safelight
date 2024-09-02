import EventEmitter from 'eventemitter3';
import { onBeforeUnmount, reactive } from 'vue';

export function createTimelineManager(canvas: HTMLCanvasElement) {
    const manager = new TimelineManager(canvas);

    return manager;
}

class TimelineManager {
    public timelineElements = new Set<TimelineElement>();
    /**
     * Currently visible elements
     */
    public visibleElements = new WeakSet<TimelineElement>();
    /**
     * Elements that are queued up for the next tick
     */
    public queuedElements = new WeakSet<TimelineElement>();

    public events = new EventEmitter<TimelineEvents>();

    public viewport = reactive({
        start: 0,
        end: 1000
    });

    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = context;

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
    }

    renderAll() {
        this.ele;
    }

    requestExtraRender(element: TimelineElement) {
        this.queuedElements.add(element);
    }

    pxToTime(pixel: number) {}
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
    init?: (
        manager: TimelineManager,
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) => any;
    render: (ctx: CanvasRenderingContext2D, manager: TimelineManager) => any;
}

export interface TimelineItemElement extends TimelineElement {
    start: number;
    end: number;
    layer: number;
}

export class VideoTimelineElement implements TimelineItemElement {
    type: TimelineElementTypes = 'layerItem';
    start = 0;
    end = 0;
    layer = 0;

    render(ctx: CanvasRenderingContext2D, manager: TimelineManager) {
        ctx.beginPath();
        ctx.moveTo(this.start, 0);
        ctx.moveTo(this.start, this.layer);
        ctx.moveTo(0, this.layer);
        ctx.moveTo(0, 0);
        ctx.closePath();
    }
}

export class TimelineCursorElement implements TimelineElement {
    type: TimelineElementTypes = 'generic';
    private cursorPos = 0;
    private isDragging = false;

    init(manager: TimelineManager) {
        manager.events.on('mouseDown', this.mouseDown);
    }

    render(ctx: CanvasRenderingContext2D, manager: TimelineManager) {
        // ctx.beginPath();
        // ctx.moveTo(this.start - 2);
    }

    private mouseDown(manager: TimelineManager, event: PointerEvent, canvas: HTMLCanvasElement) {
        if (event.clientX) {
        }
        event;
    }

    public moveCursor(time: number) {}
}
