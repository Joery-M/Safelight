import { computed, ref, shallowReactive } from 'vue';
import { ItemContainer, TimelineElementTypes, TimelineItemElement, TimelineManager } from '..';
import { canvasRestore, canvasSave } from '../tools/canvasState';

export class TimelineLayer {
    public __RENDER_TIME__ = ref(0);
    public type = TimelineElementTypes.layer;
    public index = ref(0);
    public elements = shallowReactive(new Set<TimelineItemElement>());

    /**
     * Height of the layer
     *
     * @default TimelineManager.defaultLayerHeight
     */
    public height = ref(0);

    /**
     * USED BY DEVTOOLS, DONT SET
     *
     * unless if you want to highlight this layer ofc
     */
    public _highlight = ref(false);

    private test = 0;

    public maxEnd = computed(() => {
        let maxRight = 0;
        for (const element of this.elements) {
            if (element.type == TimelineElementTypes.layerItem) {
                if ((element.end.value || 0) > maxRight) {
                    maxRight = parseFloat(element.end.value as any);
                }
            }
        }
        return maxRight;
    });

    public init(manager: TimelineManager) {
        this.height.value = manager.defaultLayerHeight.value;
    }

    public render(ctx: CanvasRenderingContext2D, manager: TimelineManager) {
        let state = canvasSave(ctx);
        ctx.fillStyle = '#18181b';
        const offsetY = manager.LayerToYPosition(this.index.value, false, true);
        ctx.fillRect(0, offsetY, ctx.canvas.width, this.height.value);

        /* Render elements */

        const container = Object.freeze<ItemContainer>({
            bottom: ctx.canvas.height - (offsetY + this.height.value),
            height: this.height.value,
            left: 0,
            right: 0,
            top: 0,
            width: ctx.canvas.width - manager.defaultLayerPaneWidth.value
        });

        canvasRestore(ctx, state);
        ctx.translate(manager.defaultLayerPaneWidth.value, offsetY);
        state = canvasSave(ctx);

        for (const element of this.elements) {
            canvasRestore(ctx, state);
            if (import.meta.env.DEV) {
                const start = performance.now();
                element.render({
                    ctx,
                    isQueued: false,
                    container,
                    layer: this,
                    manager: manager
                });
                const end = performance.now();
                element.__RENDER_TIME__.value = end - start;
            } else {
                element.render({
                    ctx,
                    isQueued: false,
                    container,
                    layer: this,
                    manager: manager
                });
            }
        }
        canvasRestore(ctx, state);
        ctx.translate(-manager.defaultLayerPaneWidth.value, -offsetY);

        ctx.fillStyle = '#18181b';
        // Layer pane
        ctx.fillRect(0, offsetY, manager.defaultLayerPaneWidth.value, this.height.value);
        ctx.fillStyle = '#3f3f46';
        // Right border
        ctx.fillRect(manager.defaultLayerPaneWidth.value - 2, offsetY, 2, this.height.value);
        // Top border in pane
        ctx.fillRect(0, offsetY - 1.5, manager.defaultLayerPaneWidth.value, 2);
        // Top border in timeline
        ctx.fillStyle = '#3f3f46A0';
        ctx.fillRect(
            manager.defaultLayerPaneWidth.value,
            offsetY - 1,
            ctx.canvas.width - manager.defaultLayerPaneWidth.value,
            1
        );

        ctx.fillStyle = 'white';
        ctx.fillText(this.index.value.toString(), 5, offsetY + this.height.value / 2);
        ctx.fillText(this.test.toString(), 20, offsetY + this.height.value / 2);

        if (this._highlight.value) {
            ctx.fillStyle = 'rgba(65, 184, 131, 0.35)';
            ctx.fillRect(0, offsetY, ctx.canvas.width, this.height.value);
        }

        this.test++;
    }
}
