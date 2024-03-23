<template>
    <div
        class="timelineItem"
        :style="{
            top: ySmooth + 'px',
            left: xSmooth + 'px',
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
import { useRound } from '@vueuse/math';
import { computed, inject } from 'vue';
import type { TimelineItem, TimelineViewport } from '.';

const { item } = defineProps<{ item: TimelineItem }>();

const viewport = inject('viewport') as TimelineViewport;

defineEmits<{
    itemChange: [TimelineItem];
}>();

const width = computed(
    () =>
        viewport.getTimePosition(item.start + item.duration) - viewport.getTimePosition(item.start)
);
const height = computed(
    () =>
        viewport.LayerToYPosition(item.layer, false, true) -
        viewport.LayerToYPosition(item.layer, true, true)
);

const x = computed(() => viewport.getTimePosition(item.start) - viewport.offsetX.value);
const y = computed(() => viewport.LayerToYPosition(item.layer, true, true));
const xSmooth = x;
const ySmooth = y;
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
