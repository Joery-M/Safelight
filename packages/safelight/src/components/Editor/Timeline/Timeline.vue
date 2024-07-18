<template>
    <SLTimeline
        v-model:items="items"
        :playback-position="pbPos"
        :fps="timeline?.framerate.value"
        :invert-scroll-axes
        :zoom-factor
        :alignment
        class="timeline h-full"
        @update:playback-position="setPbPos"
    />
</template>

<script setup lang="ts">
import { CurrentProject } from '@/stores/currentProject';
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import Timecode from '@safelight/shared/Timecode';
import { Timeline as SLTimeline, type TimelineItem } from '@safelight/timeline/source';
import { v4 as uuidv4 } from 'uuid';
import { computed, reactive } from 'vue';

const ids = new Array(17).fill('').map(() => uuidv4());

const timeline = CurrentProject.project.value?.timeline;
const pbPos = computed(() =>
    timeline?.value
        ? Timecode.fromFrames(timeline.value.pbPos.value, timeline.value.framerate.value)
        : 0
);
const invertScrollAxes = SettingsManager.getSetting<boolean>('editor.timeline.useTrackpad');
const zoomFactor = SettingsManager.getSetting<number>('editor.timeline.zoomFactor');
const alignment = SettingsManager.getSetting<'top' | 'bottom'>('editor.timeline.align');

function setPbPos(pb?: number) {
    if (pb !== undefined && timeline?.value) {
        timeline.value.pbPos.value = Timecode.toFrames(pb, timeline.value.framerate.value);
    }
}

const items = reactive<{ [key: string]: TimelineItem }>({
    [ids[0]]: {
        id: ids[0],
        name: '100 start',
        start: 1000,
        duration: 5000,
        layer: 0
    },
    [ids[1]]: {
        id: ids[1],
        name: '100 start',
        start: 1000,
        duration: 5000,
        layer: 0
    },
    [ids[2]]: {
        id: ids[2],
        name: '588 start',
        start: 5880,
        duration: 5150,
        layer: 5
    },
    [ids[3]]: {
        id: ids[3],
        name: '314 start',
        start: 3140,
        duration: 7490,
        layer: 2
    },
    [ids[4]]: {
        id: ids[4],
        name: '300 start',
        start: 3000,
        duration: 2630,
        layer: 3
    },
    [ids[5]]: {
        id: ids[5],
        name: '30 start',
        start: 300,
        duration: 7700,
        layer: 17
    },
    [ids[6]]: {
        id: ids[6],
        name: '664 start',
        start: 6640,
        duration: 2660,
        layer: 4
    },
    [ids[7]]: {
        id: ids[7],
        name: '366 start',
        start: 3660,
        duration: 1350,
        layer: 6
    },
    [ids[8]]: {
        id: ids[8],
        name: '380 start',
        start: 3800,
        duration: 4510,
        layer: 1
    }
});
</script>
<style lang="scss" scoped>
.timeline {
    --surface-100: var(--p-splitter-gutter-background);
    --red-600: var(--p-red-600);
}
</style>
