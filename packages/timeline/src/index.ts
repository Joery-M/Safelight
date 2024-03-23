import '@shoelace-style/shoelace/dist/themes/dark.css';
import { computed, reactive, ref, type Component } from 'vue';

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

/* 

Huge thanks to all the contributors of vue-devtools, especially Guillaume Chau.
This code is heavily inspired by (and copied from) the timeline implementation in vue-devtools.

Even though the original code is written for Pixi (which i have considered using), it still works beautifully here.
*/

export class TimelineViewport {
    private readonly smoothingDuration = 50;

    /**
     * The current left side boundary of the viewport in milliseconds
     *
     * @default 0 milliseconds
     */
    startTime = ref(0);
    /**
     * The current right side boundary of the viewport in milliseconds
     *
     * @default 1 second
     */
    endTime = ref(1000);

    /**
     * The minimum time that can be displayed in the viewport
     *
     * Basically the left side boundary of the viewport
     *
     * @default 0 milliseconds
     */
    minTime = ref(0);
    /**
     * The maximum time that can be displayed in the viewport
     *
     * Basically the end of the last element in the timeline
     *
     * @default 1 second (Will be overwritten once items are added)
     */
    maxTime = ref(1000);

    /**
     * The current view offset in pixels.
     *
     * Used to calculate the X position of items.
     * @see [TimelineItem](./TimelineItemComponent.vue)
     */
    offsetX = computed(() => this.getTimePosition(this.startTime.value));

    scrollY = ref(0);

    boundingBoxHeight = ref(250);
    boundingBoxWidth = ref(250);

    private constantYScale = 0.5;

    public defaultLayerHeight = 32;
    public layerHeights = reactive<number[]>([]);

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
            totalHeight + (includeOffset ? -this.scrollY.value * this.constantYScale : 0);

        if (this.alignment.value == 'bottom') {
            return this.boundingBoxHeight.value - offset;
        } else {
            return offset;
        }
    }

    zoom(delta: number, cursorPosition: number) {
        const size = this.endTime.value - this.startTime.value;

        const center = size * cursorPosition + this.startTime.value;

        let newSize = size + (delta / this.boundingBoxWidth.value) * size * 2;
        if (newSize < 10) {
            newSize = 10;
        }

        let start = center - newSize * cursorPosition;
        let end = center + newSize * (1 - cursorPosition);
        if (start < this.minTime.value) {
            start = this.minTime.value;
            end = start + newSize;
        }

        // Add a bit of padding to the end
        if (end > this.maxTime.value + 1000) {
            end = this.maxTime.value + 1000;

            // Don't allow the start to go past the minTime
            if (start > this.minTime.value) {
                start = end - newSize;
            }
        }
        this.startTime.value = start;
        this.endTime.value = end;
    }

    move(delta: number) {
        const size = this.endTime.value - this.startTime.value;
        let start = this.startTime.value + (delta / this.boundingBoxWidth.value) * size;
        let end = start + size;
        if (start < this.minTime.value) {
            start = this.minTime.value;
            end = start + size;
        }

        // Add a bit of padding to the end
        if (end > this.maxTime.value + 1000) {
            end = this.maxTime.value + 1000;
            start = end - size;
        }
        this.startTime.value = start;
        this.endTime.value = end;
    }

    /**
     * Get pixel position for given time
     */
    getTimePosition(time: number) {
        return (
            ((time - this.minTime.value) / (this.endTime.value - this.startTime.value)) *
            this.boundingBoxWidth.value
        );
    }

    highestLayer = ref(0);
}
