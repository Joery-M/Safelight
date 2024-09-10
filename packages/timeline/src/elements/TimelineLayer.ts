import { CustomInspectorState } from '@vue/devtools-api';
import { watchArray } from '@vueuse/core';
import { computed, ref, shallowReactive, shallowReadonly } from 'vue';
import { ItemContainer, TimelineItemElement, TimelineManager } from '..';

export class TimelineLayer {
    public __RENDER_TIME__ = ref(0);
    public __ELEMENT_RENDER_TIME__ = shallowReactive(new Map<TimelineItemElement, number>());
    public index = ref(0);
    // public elements = shallowReactive(new Set<TimelineItemElement>());
    public elements = shallowReadonly(
        computed(() => {
            if (!this.manager) {
                return new Set<TimelineItemElement>();
            } else {
                const items = new Set<TimelineItemElement>();
                this.manager.allLayerItems.forEach((i) => {
                    if (i.layer.value == this.index.value) {
                        items.add(i);
                    }
                });
                return items;
            }
        })
    );

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

    private manager?: TimelineManager;

    public maxEnd = computed(() => {
        let maxRight = 0;
        for (const element of this.elements.value) {
            if ((element.end.value || 0) > maxRight) {
                maxRight = parseFloat(element.end.value as any);
            }
        }
        return maxRight;
    });

    public init(manager: TimelineManager) {
        this.manager = manager;
        this.height.value = manager.defaultLayerHeight.value;

        const elemArr = computed(() => [...this.elements.value.values()]);
        watchArray(
            elemArr,
            (_cur, _old, added, removed) => {
                if (removed)
                    for (const elem of removed) {
                        this.__ELEMENT_RENDER_TIME__.delete(elem);
                    }
                for (const elem of added) {
                    if (elem['init']) elem.init({ layer: this, manager });
                }
            },
            { immediate: true, deep: false }
        );
    }

    public render(ctx: CanvasRenderingContext2D, manager: TimelineManager) {
        ctx.save();
        ctx.fillStyle = '#18181b';
        const offsetY = manager.LayerToYPosition(this.index.value, false, true);

        /* Render elements */
        const viewportWidth = manager.canvasWidth.value;

        const container = Object.freeze<ItemContainer>({
            bottom: ctx.canvas.height - (offsetY + this.height.value),
            height: this.height.value,
            left: 0,
            right: 0,
            top: 0,
            width: viewportWidth - manager.layerPaneWidth.value
        });

        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(
            manager.layerPaneWidth.value,
            0,
            manager.canvasWidth.value - manager.layerPaneWidth.value,
            manager.canvasHeight.value
        );
        ctx.clip();
        ctx.translate(manager.layerPaneWidth.value, offsetY);

        for (const element of this.elements.value) {
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
                this.__ELEMENT_RENDER_TIME__.set(element, end - start);
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
        ctx.restore();

        ctx.fillStyle = '#18181b';
        // Layer pane
        ctx.fillRect(0, offsetY, manager.layerPaneWidth.value, this.height.value);
        ctx.fillStyle = '#3f3f46';
        // Right border
        ctx.fillRect(manager.layerPaneWidth.value - 2, offsetY, 2, this.height.value);
        // Top border in pane
        ctx.fillRect(0, offsetY - 1.5, manager.layerPaneWidth.value, 2);
        // Top border in timeline
        ctx.fillStyle = '#3f3f46A0';
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillRect(
            manager.layerPaneWidth.value,
            offsetY - 1,
            viewportWidth - manager.layerPaneWidth.value,
            1
        );
        ctx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, offsetY, manager.layerPaneWidth.value - 2, this.height.value);
        ctx.clip();

        // Layer pane contents
        ctx.fillStyle = 'white';
        ctx.fillText(this.index.value.toString(), 5, offsetY + this.height.value / 2);
        ctx.fillText(this.test.toString(), 20, offsetY + this.height.value / 2);

        ctx.restore();

        if (this._highlight.value) {
            ctx.fillStyle = 'rgba(65, 184, 131, 0.35)';
            ctx.fillRect(0, offsetY, viewportWidth, this.height.value);
        }

        this.test++;
    }

    public _devtools_get_state = (): CustomInspectorState => {
        return {
            Positioning: [
                {
                    key: 'Offset Y',
                    value: this.manager?.LayerToYPosition(this.index.value, false, true)
                }
            ],
            'Render time': [
                {
                    key: 'layer ms',
                    value: this.__RENDER_TIME__.value
                },
                {
                    key: '% of timeline',
                    value:
                        Math.round(
                            (this.__RENDER_TIME__.value /
                                (this.manager?.__RENDER_TIME__.value ?? 10000)) *
                                100
                        ) + '%'
                },
                {
                    key: '% rendering self',
                    value:
                        Math.round(
                            ((this.__RENDER_TIME__.value -
                                Array.from(this.__ELEMENT_RENDER_TIME__.values()).reduce(
                                    (p, c) => c + p,
                                    0
                                )) /
                                this.__RENDER_TIME__.value) *
                                100
                        ) + '%'
                }
            ]
        };
    };
}
