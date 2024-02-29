<template>
    <SLTimeline
        v-model="tlComponentItems"
        v-model:start="timelineViewStart"
        v-model:end="timelineViewEnd"
    />
</template>

<script lang="ts" setup>
import type { TimelineComponentItem } from '@/@core/components/Timeline/SLTimeline.vue';
import type BaseTimelineItem from '@/controllers/base/TimelineItem';

const project = useProject();
const timeline = storeToRefs(project).activeTimeline;

const timelineViewStart = ref(0);
const timelineViewEnd = ref(10 * 1000);

// NEEDS IMPROVEMENT
// This is a very naïve way of
const tlComponentItems = useArrayMap<BaseTimelineItem, TimelineComponentItem>(
    timeline.value.items,
    (elem) => {
        console.log({
            start: elem.start.time,
            end: elem.end.time,
            id: elem.id,
            isGhost: false,
            layer: elem.layer,
            title: elem.media.map((m) => m.name).join(' - ')
        });
        return {
            start: elem.start.time,
            end: elem.end.time,
            id: elem.id,
            isGhost: false,
            layer: elem.layer,
            title: elem.media.map((m) => m.name).join(' - ')
        };
    }
);
</script>
