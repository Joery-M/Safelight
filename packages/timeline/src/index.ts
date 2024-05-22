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

export interface TimelineProps {
    /**
     * Whether to align the timeline to the top or bottom.
     *
     * Useful when you have 2 timelines vertically stacked.
     *
     * @default 'bottom'
     */
    alignment?: TimelineAlignment;
    /**
     * The scale factor when zooming.
     *
     * @default 2
     */
    zoomFactor?: number;
    /**
     * Whether to invert the axis that scrolling uses.
     *
     * Used for trackpads.
     *
     * @default false
     */
    invertScrollAxes?: boolean;
    /**
     * Whether to invert the vertical scrolling.
     *
     * @default false
     */
    invertVerticalScroll?: boolean;
    /**
     * Whether to invert the horizontal scrolling.
     *
     * @default false
     */
    invertHorizontalScroll?: boolean;
    /**
     * Current timeline FPS
     *
     * @default Infinity
     */
    fps?: number;
}

/* 

Huge thanks to all the contributors of vue-devtools, especially Guillaume Chau.
This code is heavily inspired by (and copied from) the timeline implementation in vue-devtools.

Even though the original code is written for Pixi (which i have considered using), it still works beautifully here.
*/

export class TimelineViewport {
    /**
     * The amount of padding to add to the end of the timeline in milliseconds
     */
    readonly endPadding = 1000;

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
    endTime = ref(10000);

    /**
     * The current bottom side boundary of the viewport, when alignment is set to 'bottom'.
     *
     * If alignment is set to 'top', this value is the top side boundary.
     *
     * @default 0
     */
    startY = ref(0);

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

    boundingBoxHeight = ref(250);
    boundingBoxWidth = ref(250);

    timebarHeight = ref(0);

    /**
     * Current playback position in milliseconds
     */
    pbPos = ref<number | undefined>(0);

    fps = ref(Infinity);
    frameDuration = computed(() => 1000 / this.fps.value);

    private constantYScale = 0.5;

    public defaultLayerHeight = 32;
    public zoomFactor = ref(2);

    public layerHeights = reactive<number[]>([]);
    highestLayer = ref(0);

    alignment = ref<TimelineAlignment>('bottom');

    /**
     * Convert a layer index to its corresponding Y position
     */
    LayerToYPosition(
        layer: number,
        includeCurrent = false,
        includeOffset = false,
        useAlignment = true
    ) {
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

        const offset = totalHeight + (includeOffset ? -this.startY.value * this.constantYScale : 0);

        if (this.alignment.value == 'bottom' && useAlignment) {
            return this.boundingBoxHeight.value - offset;
        } else {
            return offset;
        }
    }

    zoom(delta: number, cursorPosition = 0.5) {
        const size = this.endTime.value - this.startTime.value;

        const center = size * cursorPosition + this.startTime.value;

        let newSize = size + (delta / this.boundingBoxWidth.value) * size * this.zoomFactor.value;
        if (newSize < 50) {
            newSize = 50;
        }

        let start = center - newSize * cursorPosition;
        let end = center + newSize * (1 - cursorPosition);
        if (start < this.minTime.value) {
            start = this.minTime.value;
            end = start + newSize;
        }

        // Add a bit of padding to the end
        if (end > this.maxTime.value + this.endPadding) {
            end = this.maxTime.value + this.endPadding;

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
        if (end > this.maxTime.value + this.endPadding) {
            end = this.maxTime.value + this.endPadding;
            start = end - size;
        }
        this.startTime.value = start;
        this.endTime.value = end;
    }

    moveY(delta: number) {
        if (this.alignment.value == 'bottom') {
            this.startY.value -= delta;
            if (this.startY.value < 0) {
                this.startY.value = 0;
            }

            const maxHeight =
                this.LayerToYPosition(this.highestLayer.value + 2, true, false, false) +
                this.boundingBoxHeight.value / 2;
            if (this.startY.value > maxHeight) {
                this.startY.value = maxHeight;
            }
        } else {
            this.startY.value += delta;
            if (this.startY.value < this.defaultLayerHeight * 2) {
                this.startY.value = this.defaultLayerHeight * 2;
            }

            const maxHeight =
                this.LayerToYPosition(this.highestLayer.value + 2, true, false, false) +
                this.boundingBoxHeight.value;
            if (this.startY.value > maxHeight) {
                this.startY.value = maxHeight;
            }
        }
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

    getPositionTime(position: number) {
        return (
            (position / this.boundingBoxWidth.value) * (this.endTime.value - this.startTime.value)
        );
    }

    /**
     * Get whether the item is visible in the current viewport horizontally.
     *
     * I hope no one needs to have like 10000 items stacked vertically.
     */
    isItemVisible(item: TimelineItem) {
        const isHorizontalVisible =
            item.start + item.duration >= this.startTime.value && item.start <= this.endTime.value;
        return isHorizontalVisible;
    }
}
