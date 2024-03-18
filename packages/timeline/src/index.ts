import { ref, type Component } from 'vue';

export * from './Timeline.vue';

export interface TimelineItem {
    id: string;
    name: string;
    color?: string;
    icon?: Component;
    start: number;
    duration: number;
}

export type TimelineAlignment = 'top' | 'bottom';

export class TimelineViewport {
    x = ref(0);
    y = ref(0);
    scaleX = ref(1);
    scaleY = ref(1);

    private constantXScale = 1;

    private layerHeights = new Map<number, number>();

    alignment: TimelineAlignment = 'bottom';

    TimecodeToXPosition(timecode: number) {
        return timecode / (this.scaleX.value * this.constantXScale) - this.x.value;
    }

    /**
     * Convert a layer index to its corresponding Y position
     */
    LayerToYPosition(layer: number, includeCurrent = false) {
        let totalHeight = 0;
        if (includeCurrent) {
            this.layerHeights.forEach((curHeight, curLayer) => {
                if (curLayer <= layer) {
                    totalHeight += curHeight;
                }
            });
        } else {
            this.layerHeights.forEach((curHeight, curLayer) => {
                if (curLayer < layer) {
                    totalHeight += curHeight;
                }
            });
        }
        return totalHeight * this.scaleY.value;
    }
}
