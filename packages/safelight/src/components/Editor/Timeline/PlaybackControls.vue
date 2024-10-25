<template>
    <template v-if="timeline">
        <Timecode />
        <ButtonGroup>
            <Button
                severity="secondary"
                :aria-label="$t('general.actions.skipBackFrame', 1)"
                :title="$t('general.actions.skipBackFrame', 1)"
                icon="ph ph-skip-back"
                @click="if (!timeline.isPlaying.value) timeline.stepPlayback(true);"
            />
            <Button
                severity="secondary"
                :aria-label="timeline.isPlaying.value ? 'Stop playback' : 'Start playback'"
                :icon="timeline.isPlaying.value ? 'ph ph-pause' : 'ph ph-play'"
                @click="playPause"
            />
            <Button
                severity="secondary"
                :aria-label="$t('general.actions.skipForwardFrame', 1)"
                :title="$t('general.actions.skipForwardFrame', 1)"
                icon="ph ph-skip-forward"
                @click="if (!timeline.isPlaying.value) timeline.stepPlayback();"
            />
        </ButtonGroup>
    </template>
</template>

<script lang="ts" setup>
import { useProject } from '@/stores/useProject';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import { computed } from 'vue';
import Timecode from './Timecode.vue';

const project = useProject();

const timeline = computed(() => project.p?.timeline?.value);

function playPause(ev: MouseEvent) {
    if (timeline?.value) {
        if (timeline.value.isPlaying.value) {
            timeline.value.stopPlayback(ev.ctrlKey);
        } else {
            timeline.value.startPlayback();
        }
    }
}
</script>
