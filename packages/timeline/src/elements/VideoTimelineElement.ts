import { CustomInspectorState } from '@vue/devtools-api';
import EventEmitter from 'eventemitter3';
import { TimelineItemElement, TimelineItemRenderPayload } from '..';
import { MoveableItemEvent, MoveableTimelineItem } from './MoveableTimelineItem';

export class VideoTimelineElement extends MoveableTimelineItem implements TimelineItemElement {
    private tempHue = 0;
    protected id = crypto.randomUUID();

    public events = new EventEmitter<MoveableItemEvent>();

    render = (payload: TimelineItemRenderPayload) => {
        const { ctx, manager, container } = payload;
        // Offset
        const offset = manager.msToPx(Math.min(this.start.value, this.end.value), true);
        ctx.save();
        ctx.translate(offset, 0);

        // Square
        const elemWidth = manager.msToPx(
            this.start.value < this.end.value
                ? Math.abs(this.end.value - this.start.value)
                : Math.abs(this.start.value - this.end.value)
        );
        this.tempHue += 10;
        this.tempHue %= 360;
        ctx.fillStyle = `hsl(${this.tempHue}, 50%, 20%)`;
        ctx.fillRect(0, 0, Math.abs(elemWidth), container.height);

        // Text
        ctx.fillStyle = 'white';
        const text = (this.tempHue / 10).toString();
        const textSize = ctx.measureText(text);
        ctx.fillText(
            text,
            elemWidth / 2 - textSize.width / 2,
            container.height / 2 + textSize.hangingBaseline / 2
        );
        super.render(payload);

        ctx.restore();
    };

    devtoolsState = (): CustomInspectorState => {
        const state = {
            item: [
                {
                    key: 'start',
                    value: this.start?.value,
                    editable: false
                },
                {
                    key: 'end',
                    value: this.end?.value,
                    editable: false
                }
            ],
            interaction: [
                {
                    key: 'Cursor inside',
                    value: this.cursorInside.value
                },
                {
                    key: 'isDragging',
                    value: this.isDragging.value
                },
                {
                    key: 'dragLastX',
                    value: this.dragLastX.value
                },
                {
                    key: 'dragIdealX',
                    value: this.dragIdealX.value
                }
            ]
        };
        return state;
    };
}
