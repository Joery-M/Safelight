<template>
    <div
        class="timelineItem"
        :style="{
            transform:
                `translate(` +
                viewport.TimecodeToXPosition(item.start) +
                `px, ${viewport.LayerToYPosition(item.layer, false, true)}px)`,
            width:
                viewport.TimecodeToXPosition(item.start + item.duration) -
                viewport.TimecodeToXPosition(item.start) +
                'px',
            height:
                viewport.LayerToYPosition(item.layer, true) -
                viewport.LayerToYPosition(item.layer) +
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
    background-color: purple;

    p {
        margin: 0;
        white-space: nowrap;
    }
}
</style>
