import EventEmitter from 'eventemitter3';
import { ref, watch } from 'vue';
import type { TimelineItem, TimelineItemInitPayload, TimelineItemRenderPayload } from '..';
import { useSteppedRef } from '../tools/useSteppedRef';

export abstract class MoveableTimelineItem implements TimelineItem {
    protected cursorInside = ref(false);
    /**
     * ID used internally
     */
    protected abstract id: string;
    public abstract events: EventEmitter<MoveableItemEvent>;

    frameInterval = ref(1);
    start = useSteppedRef(0, this.frameInterval);
    end = useSteppedRef(1000, this.frameInterval);
    layer = ref(0);

    protected isDragging = ref(false);
    private dragLastX = ref(0);
    protected dragIdealX = ref(0);
    private dragLastLayer = ref(0);
    protected dragIdealLayer = ref(0);

    init({ manager, layer }: TimelineItemInitPayload) {
        let lastMouseX = 0;
        manager.events.on('mouseMove', ({ mouseData }) => {
            this.cursorInside.value =
                mouseData.isInsideCanvas &&
                mouseData.ms >= this.start.value &&
                mouseData.ms <= this.end.value &&
                mouseData.hoverLayer?.index.value === layer.index.value;

            if (this.isDragging.value) {
                lastMouseX = mouseData.x;
                const oldLayer = this.layer.value;
                this.dragIdealX.value += mouseData.ms - this.dragLastX.value;
                this.dragIdealLayer.value = mouseData.hoverLayerIndex;

                this.dragLastX.value = mouseData.ms;
                const size = this.end.value - this.start.value;
                const oldStart = this.start.value;
                const oldEnd = this.start.value;
                this.start.value = Math.max(this.dragIdealX.value, manager.leftBoundary.value);
                this.end.value = this.start.value + size;
                this.layer.value = Math.max(
                    0,
                    Math.min(this.dragIdealLayer.value, manager.layers.size - 1)
                );

                if (oldLayer !== this.layer.value) {
                    this.events.emit('layerChange', this.layer.value, oldLayer);
                }

                if (this.start.value !== oldStart || this.end.value !== oldEnd) {
                    this.events.emit('move', this.start.value, this.end.value);
                }
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
                this.dragLastLayer.value = layer.index.value;
                this.dragIdealLayer.value = mouseData.hoverLayerIndex;
                lastMouseX = mouseData.x;
                this.isDragging.value = true;
            }
        });

        manager.events.on('mouseUp', () => {
            if (this.isDragging.value) {
                this.isDragging.value = false;
                this.events.emit('drop', this.start.value, this.end.value, this.layer.value);
            }
        });

        // This really doesn't work atm, needs to take drag distance into account
        // This should eventually get replaced with a better interaction system
        manager.events.on('mouseClick', () => {
            if (this.cursorInside.value) {
                this.events.emit('click');
                console.log('Click');
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
            ctx.save();
            const screenSpacePoint = ctx
                .getTransform()
                .transformPoint({ x: container.left, y: container.top });

            ctx.globalAlpha = 0.4;

            ctx.fillRect(container.left - 0.5, -screenSpacePoint.y, 1, manager.canvasHeight.value);

            const rightEnd = manager.msToPx(this.end.value - this.start.value);
            ctx.fillRect(rightEnd - 0.5, -screenSpacePoint.y, 1, manager.canvasHeight.value);
            ctx.restore();
        }
    }
}

export interface MoveableItemEvent {
    layerChange: [newLayer: number, oldLayer: number];
    move: [newStart: number, newEnd: number];
    drop: [newStart: number, newEnd: number, newLayer: number];
    click: [];
}
