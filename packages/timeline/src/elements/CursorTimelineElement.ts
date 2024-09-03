import { TimelineElement, TimelineElementTypes, TimelineManager } from '..';

export class TimelineCursorElement implements TimelineElement {
    type: TimelineElementTypes = 'generic';
    /**
     * Cursor position in milliseconds
     */
    private cursorPos = 0;
    private isDragging = false;

    init(manager: TimelineManager) {
        manager.events.on('mouseDown', this.mouseDown);
    }

    render(_ctx: CanvasRenderingContext2D, _manager: TimelineManager) {
        // ctx.beginPath();
        // ctx.moveTo(this.start - 2);
    }

    private mouseDown(_manager: TimelineManager, event: PointerEvent, _canvas: HTMLCanvasElement) {
        if (event.clientX) {
        }
        event;
    }

    public moveCursor(_time: number) {}
}
