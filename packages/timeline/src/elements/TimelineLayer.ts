import { computed, ref, shallowReactive, watch } from 'vue';
import { TimelineElementTypes, TimelineItemElement, TimelineManager } from '..';
import { debouncedRef } from '@vueuse/core';

export class TimelineLayer {
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
     */
    public highlight = ref(false);
    private highlightDebounce = debouncedRef(this.highlight, 300);

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

    private manager!: TimelineManager;

    public init(manager: TimelineManager) {
        this.manager = manager;

        this.height.value = manager.defaultLayerHeight.value;

        watch([this.elements, this.highlightDebounce], () => {
            this.manager.requestExtraRender();
        });
        let unhighlightTimeout: ReturnType<typeof setTimeout> | undefined;
        watch(this.highlight, (highlight) => {
            if (highlight) {
                clearTimeout(unhighlightTimeout);
                unhighlightTimeout = setTimeout(() => {
                    this.highlight.value = false;
                }, 300);
            }
        });
    }

    public render(ctx: CanvasRenderingContext2D, _manager: TimelineManager, _queued: boolean) {
        ctx.fillStyle = this.index.value % 2 == 0 ? '#404040' : '#a0a0a0';
        const offsetY = this.height.value * this.index.value;
        ctx.fillRect(0, offsetY, ctx.canvas.width, this.height.value);
        ctx.fillStyle = this.index.value % 2 == 1 ? '#404040' : '#a0a0a0';
        ctx.fillText(this.test.toString(), 20, offsetY + this.height.value / 2);
        this.test++;
        if (this.highlightDebounce.value) {
            ctx.fillStyle = '#e8bf2d';
            ctx.lineWidth = 2;
            ctx.fillRect(ctx.canvas.width - 2, offsetY, 2, this.height.value);
        }
    }
}
