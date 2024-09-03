import { ref, watch } from 'vue';
import { TimelineElementTypes, TimelineItemElement, TimelineManager } from '..';

export class VideoTimelineElement implements TimelineItemElement {
    type: TimelineElementTypes = 'layerItem';

    private tempHue = 0;

    start = ref(0);
    end = ref(0);
    layer = ref(100);

    init = (manager: TimelineManager) => {
        watch([this.start, this.end, this.layer], () => {
            manager.requestExtraRender();
        });
    };

    render = (ctx: CanvasRenderingContext2D, manager: TimelineManager) => {
        // Offset
        const offset = manager.msToPx(this.start.value) - manager.offsetX.value;
        ctx.translate(offset, 0);

        // Square
        const elemWidth = manager.msToPx(Math.abs(this.end.value - this.start.value));
        this.tempHue += 10;
        this.tempHue %= 360;
        ctx.fillStyle = `hsl(${this.tempHue}, 50%, 20%)`;
        ctx.fillRect(0, 0, elemWidth, this.layer.value);

        // Text
        ctx.fillStyle = 'white';
        ctx.font = 'Arial';
        const text = (this.tempHue / 10).toString();
        const textSize = ctx.measureText(text);
        ctx.fillText(text, elemWidth / 2 - textSize.width / 2, 20);

        // Move back
        ctx.translate(-offset, 0);
    };
}
