import type { CustomInspectorNode, CustomInspectorState } from '@vue/devtools-kit';
import { toValue, watchArray } from '@vueuse/core';
import { computed, ref, shallowReactive } from 'vue';
import { __DEVTOOLS_AVAILABLE__, type ItemContainer, type TimelineItem, TimelineManager } from '..';

export class TimelineLayer {
    public __RENDER_TIME__ = ref(0);
    public __ELEMENT_RENDER_TIME__ = shallowReactive(new Map<TimelineItem, number>());
    public index = ref(0);
    public elements = computed(() => {
        if (!this.manager) {
            return new Set<TimelineItem>();
        } else {
            const items = new Set<TimelineItem>();
            this.manager.allLayerItems.forEach((i) => {
                if (i.layer.value == this.index.value) {
                    items.add(i);
                }
            });
            return items;
        }
    });

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

        const viewStart = manager.viewportSmooth.start.value;
        const viewEnd = manager.viewportSmooth.end.value;

        for (const element of this.elements.value) {
            const elemStart = element.start.value - (toValue(element.renderMargin) ?? 0);
            const elemEnd = element.end.value + (toValue(element.renderMargin) ?? 0);

            if (__DEVTOOLS_AVAILABLE__.value) {
                if (elemStart <= viewEnd && viewStart <= elemEnd) {
                    const start = performance.now();
                    element.render({
                        ctx,
                        container,
                        layer: this,
                        manager: manager
                    });
                    const end = performance.now();
                    this.__ELEMENT_RENDER_TIME__.set(element, end - start);
                } else {
                    this.__ELEMENT_RENDER_TIME__.set(element, NaN);
                }
            } else {
                if (elemStart <= viewEnd && viewStart <= elemEnd) {
                    element.render({
                        ctx,
                        container,
                        layer: this,
                        manager: manager
                    });
                }
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

    public _devtools_get_tree = (id: string) => {
        return {
            id: 'layer::' + id + '::' + this.index.value,
            label: `Layer ${this.index.value + 1}`,
            children: Array.from(this.elements.value)
                .map<CustomInspectorNode | undefined>((element, i) => {
                    if (element.devtoolsTree) {
                        const hidden = isNaN(this.__ELEMENT_RENDER_TIME__.get(element) ?? 0);
                        return element.devtoolsTree(id + '::' + this.index.value, hidden, i);
                    } else {
                        return undefined;
                    }
                })
                .filter((i) => i !== undefined)
        };
    };
}
