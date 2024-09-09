import { ref, watch } from 'vue';
import { TimelineItemElement, TimelineItemInitPayload, TimelineItemRenderPayload } from '..';
import { useSteppedRef } from '../tools/useSteppedRef';

export abstract class MoveableTimelineItem implements TimelineItemElement {
    protected cursorInside = ref(false);
    /**
     * ID used internally
     */
    protected abstract id: string;

    frameInterval = ref(1);
    start = useSteppedRef(0, this.frameInterval);
    end = ref(1000);

    protected isDragging = ref(false);
    protected dragLastX = ref(0);
    protected dragIdealX = ref(0);

    init({ manager, layer }: TimelineItemInitPayload) {
        let lastMouseX = 0;
        manager.events.on('mouseMove', ({ mouseData }) => {
            if (mouseData.isInsideCanvas) {
                this.cursorInside.value =
                    mouseData.ms >= this.start.value &&
                    mouseData.ms <= this.end.value &&
                    mouseData.hoverLayer?.index.value === layer.index.value;
            }

            if (this.isDragging.value) {
                lastMouseX = mouseData.x;
                this.dragIdealX.value += mouseData.ms - this.dragLastX.value;

                this.dragLastX.value = mouseData.ms;
                const size = this.end.value - this.start.value;
                this.start.value = this.dragIdealX.value;
                this.end.value = this.start.value + size;
            }
        });

        manager.events.on('pan', () => {
            if (this.isDragging.value) {
                const mouseMs = manager.pxToMs(lastMouseX, true, true);
                this.dragIdealX.value += mouseMs - this.dragLastX.value;

                this.dragLastX.value = mouseMs;
                const size = this.end.value - this.start.value;
                this.start.value = this.dragIdealX.value;
                this.end.value = this.start.value + size;
            }
        });

        manager.events.on('mouseDown', ({ mouseData }) => {
            if (this.cursorInside.value) {
                this.dragLastX.value = mouseData.ms;
                this.dragIdealX.value = this.start.value;
                lastMouseX = mouseData.x;
                this.isDragging.value = true;
            }
        });

        manager.events.on('mouseUp', () => {
            if (this.isDragging.value) {
                this.isDragging.value = false;
            }
        });

        watch(this.isDragging, (isDragging) => {
            if (isDragging) {
                manager.cursor.set(this.id, ['grabbing', 100]);
            } else if (manager.cursor.has(this.id)) {
                manager.cursor.delete(this.id);
            }
        });
    }

    render({ ctx, container, manager }: TimelineItemRenderPayload) {
        if (this.isDragging.value) {
            const screenSpacePoint = ctx
                .getTransform()
                .transformPoint({ x: container.left, y: container.top });

            ctx.fillRect(container.left, -screenSpacePoint.y, 1, manager.canvasHeight.value);

            const rightEnd = manager.msToPx(this.end.value - this.start.value);
            ctx.fillRect(rightEnd, -screenSpacePoint.y, 1, manager.canvasHeight.value);
        }
    }
}
