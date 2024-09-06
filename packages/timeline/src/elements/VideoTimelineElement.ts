import { computed, ref } from 'vue';
import { TimelineItemElement } from '..';

export class VideoTimelineElement implements TimelineItemElement {
    private tempHue = 0;

    start = ref(0);
    end = ref(1000);

    frameInterval = ref(1);

    private startSnapped = computed(
        () => Math.ceil(this.start.value / this.frameInterval.value) * this.frameInterval.value
    );
    private endSnapped = computed(
        () => Math.ceil(this.end.value / this.frameInterval.value) * this.frameInterval.value
    );

    render: TimelineItemElement['render'] = ({ ctx, manager, container }) => {
        // Offset
        const offset =
            manager.msToPx(Math.min(this.startSnapped.value, this.endSnapped.value)) -
            manager._offsetX.value;
        ctx.translate(offset, 0);

        // Square
        const elemWidth = manager.msToPx(
            this.startSnapped.value < this.endSnapped.value
                ? Math.abs(this.endSnapped.value - this.startSnapped.value)
                : Math.abs(this.startSnapped.value - this.endSnapped.value)
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
