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
import type { UnwrapNestedRefs } from 'vue';

const project = useProject();

const timelineViewStart = ref(0);
const timelineViewEnd = ref(10 * 1000);

const items = ref<BaseTimelineItem[]>([]);

watchArray(
    project.activeTimeline.items,
    () => {
        items.value = project.activeTimeline.items;
    },
    { deep: true }
);

// NEEDS IMPROVEMENT
// This is a very naïve way of
const tlComponentItems = useArrayMap<UnwrapNestedRefs<BaseTimelineItem>, TimelineComponentItem>(
    items,
    (elem) => {
        return {
            start: elem.start,
            end: elem.end,
            id: elem.id,
            isGhost: false,
            layer: elem.layer,
            title: elem.isAudioVideo() ? elem.media.value?.name.value ?? 'Untitled' : 'Untitled'
        };
    }
);
</script>
