<template>
    <div
        class="timelineItem"
        :style="{
            top: y + 'px',
            left: useMax(x, 0).value + 'px',
            width: width + 'px',
            height: height + 'px'
        }"
    >
        <p>
            {{ item.name }} -
            {{ useRound(viewport.getTimePosition(item.start)) }}
            {{ useRound(width) }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { useMax, useRound } from '@vueuse/math';
import { computed, inject } from 'vue';
import type { TimelineItem, TimelineViewport } from '.';

const { item } = defineProps<{ item: TimelineItem }>();

const viewport = inject('viewport') as TimelineViewport;

defineEmits<{
    itemChange: [TimelineItem];
}>();

// Calculate width of item, but not larger than the viewport (for CSS reasons)
// and if the x position is less than 0, subtract it from the width to make the
// item stick to the left side
const width = computed(() => {
    let width =
        viewport.getTimePosition(item.start + item.duration) - viewport.getTimePosition(item.start);

    if (x.value < 0) {
        // Already negative
        width += x.value;
    }

    // Viewport width without overflowing left side
    const viewportWidth = viewport.boundingBoxWidth.value + (x.value > 0 ? -x.value : 0);

    return width > viewportWidth ? viewportWidth : width;
});
const height = computed(
    () =>
        viewport.LayerToYPosition(item.layer, false, true) -
        viewport.LayerToYPosition(item.layer, true, true)
);

const x = computed(() => viewport.getTimePosition(item.start) - viewport.offsetX.value);
const y = computed(() => viewport.LayerToYPosition(item.layer, true, true));
</script>

<style lang="scss" scoped>
.timelineItem {
    position: absolute;
    overflow-x: scroll;
    background-color: purple;
    height: 32px;
    z-index: 3;

    p {
        margin: 0;
        white-space: nowrap;
    }
}
</style>
