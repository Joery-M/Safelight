import { ref } from 'vue';
import { TimelineElementTypes, TimelineItemElement } from '..';

export class VideoTimelineElement implements TimelineItemElement {
    public __RENDER_TIME__ = ref(0);
    type: TimelineElementTypes.layerItem = TimelineElementTypes.layerItem;
    private tempHue = 0;

    start = ref(0);
    end = ref(100);

    render: TimelineItemElement['render'] = ({ ctx, manager, container }) => {
        // Offset
        const offset =
            manager.msToPx(Math.min(this.start.value, this.end.value)) - manager._offsetX.value;
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

        // Move back
        ctx.translate(-offset, -container.top);
    };
}
