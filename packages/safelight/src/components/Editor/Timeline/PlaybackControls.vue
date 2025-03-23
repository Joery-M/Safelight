<template>
    <template v-if="project.timeline">
        <Timecode />
        <ButtonGroup>
            <Button
                severity="secondary"
                :aria-label="$t('general.actions.skipBackFrame', 1)"
                :title="$t('general.actions.skipBackFrame', 1)"
                icon="i-ph-skip-back"
                @click="if (!project.timeline.isPlaying.value) project.timeline.stepPlayback(true);"
            />
            <Button
                severity="secondary"
                :aria-label="project.timeline.isPlaying.value ? 'Stop playback' : 'Start playback'"
                :icon="project.timeline.isPlaying.value ? 'i-ph-pause' : 'i-ph-play'"
                @click="playPause"
            />
            <Button
                severity="secondary"
                :aria-label="$t('general.actions.skipForwardFrame', 1)"
                :title="$t('general.actions.skipForwardFrame', 1)"
                icon="i-ph-skip-forward"
                @click="if (!project.timeline.isPlaying.value) project.timeline.stepPlayback();"
            />
        </ButtonGroup>
    </template>
</template>

<script lang="ts" setup>
import { useProject } from '@/stores/useProject';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Timecode from './Timecode.vue';

const project = useProject();

function playPause(ev: MouseEvent) {
    if (project.timeline) {
        if (project.timeline.isPlaying.value) {
            project.timeline.stopPlayback(ev.ctrlKey);
        } else {
            project.timeline.startPlayback();
        }
    }
}
</script>
