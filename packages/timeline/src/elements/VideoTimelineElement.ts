import type { CustomInspectorState } from '@vue/devtools-kit';
import EventEmitter from 'eventemitter3';
import type { TimelineItem, TimelineItemRenderPayload } from '..';
import { type MoveableItemEvent, MoveableTimelineItem } from './MoveableTimelineItem';

export class VideoTimelineElement extends MoveableTimelineItem implements TimelineItem {
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
                    key: 'Is dragging',
                    value: this.isDragging.value
                }
            ]
        };
        return state;
    };

    devtoolsTree = (id: string, hidden: boolean, index: number) => {
        return {
            id: 'element::' + id + ';' + index,
            label: 'Element ' + index,
            tags: hidden
                ? [
                      {
                          label: 'Hidden',
                          backgroundColor: 0x181818,
                          textColor: 0xc9c9c9
                      }
                  ]
                : []
        };
    };
}
