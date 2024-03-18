<template>
    <div
        class="timelineItem"
        :style="{
            transform: `translate(` + viewport.TimecodeToXPosition(item.start) + `px, 0px)`,
            width:
                viewport.TimecodeToXPosition(item.start + item.duration) -
                viewport.TimecodeToXPosition(item.start) +
                'px'
        }"
    >
        <p>Timeline item works! {{ item.id }} {{ viewport.TimecodeToXPosition(item.start) }}</p>
    </div>
</template>

<script setup lang="ts">
import type { TimelineItem, TimelineViewport } from '.';

const { viewport, item } = defineProps<{ item: TimelineItem; viewport: TimelineViewport }>();

defineEmits<{
    itemChange: [TimelineItem];
}>();
</script>

<style lang="scss" scoped>
.timelineItem {
    position: absolute;
    overflow-x: scroll;

    p {
        margin: 0;
        white-space: nowrap;
    }
}
</style>
