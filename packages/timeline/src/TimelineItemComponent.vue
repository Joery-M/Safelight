<template>
    <div
        class="timelineItem"
        :style="{
            transform:
                `translate(` +
                viewport.millisecondsToX(item.start).value +
                `px, ${viewport.LayerToYPosition(item.layer, false, true)}px)`,
            width: width + 'px',
            height: height + 'px'
        }"
    >
        <p>
            {{ item.name }} -
            {{ viewport.millisecondsToX(item.start).value }}
            {{ width }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TimelineItem, TimelineViewport } from '.';

const { viewport, item } = defineProps<{ item: TimelineItem; viewport: TimelineViewport }>();

defineEmits<{
    itemChange: [TimelineItem];
}>();

const width = computed(
    () =>
        viewport.millisecondsToX(item.start + item.duration).value -
        viewport.millisecondsToX(item.start).value
);
const height = computed(
    () => viewport.LayerToYPosition(item.layer, true) - viewport.LayerToYPosition(item.layer)
);
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
