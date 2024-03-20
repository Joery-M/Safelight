import { createProjection } from '@vueuse/math';
import { computed, ref, type Component } from 'vue';

export { default as Timeline } from './Timeline.vue';

export interface TimelineItem {
    id: string;
    name: string;
    color?: string;
    icon?: Component;
    start: number;
    duration: number;
    layer: number;
}

export type TimelineAlignment = 'top' | 'bottom';

export class TimelineViewport {
    x = ref(0);
    y = ref(0);
    scaleX = ref(1);
    scaleY = ref(1);
    boundingBoxHeight = ref(250);
    boundingBoxWidth = ref(250);

    private boundingBoxMs = computed<readonly [number, number]>(() => [
        this.x.value * this.scaleX.value,
        (this.x.value + 1000) * this.scaleX.value
    ]);
    private boundingBox = computed<readonly [number, number]>(() => [
        0,
        this.boundingBoxWidth.value
    ]);

    millisecondsToX = createProjection(this.boundingBoxMs, this.boundingBox);
    xToMilliseconds = createProjection(this.boundingBox, this.boundingBoxMs);

    private constantYScale = 0.5;

    private defaultLayerHeight = 32;
    private layerHeights: number[] = [];

    alignment = ref<TimelineAlignment>('bottom');

    /**
     * Convert a layer index to its corresponding Y position
     */
    LayerToYPosition(layer: number, includeCurrent = false, includeOffset = false) {
        let totalHeight = 0;
        if (includeCurrent) {
            for (let i = 0; i <= layer; i++) {
                const curHeight = this.layerHeights[i] ?? this.defaultLayerHeight;
                totalHeight += curHeight;
            }
        } else {
            for (let i = 0; i < layer; i++) {
                const curHeight = this.layerHeights[i] ?? this.defaultLayerHeight;
                totalHeight += curHeight;
            }
        }

        const offset =
            totalHeight +
            (includeOffset ? -this.y.value * this.constantYScale : 0) * this.scaleY.value;

        if (this.alignment.value == 'bottom') {
            return this.boundingBoxHeight.value - offset;
        } else {
            return offset;
        }
    }
}
