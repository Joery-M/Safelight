<template>
    <template v-if="timeline">
        <Timecode />
        <ButtonGroup>
            <Button
                severity="secondary"
                :aria-label="$t('general.actions.skipBackFrame', 1)"
                :title="$t('general.actions.skipBackFrame', 1)"
                @click="if (!timeline.isPlaying.value) timeline.stepPlayback(true);"
            >
                <template #icon>
                    <PhSkipBack />
                </template>
            </Button>
            <Button
                severity="secondary"
                :aria-label="timeline.isPlaying.value ? 'Stop playback' : 'Start playback'"
                @click="playPause"
            >
                <template #icon>
                    <PhPause v-if="timeline.isPlaying.value" />
                    <PhPlay v-else />
                </template>
            </Button>
            <Button
                severity="secondary"
                :aria-label="$t('general.actions.skipForwardFrame', 1)"
                :title="$t('general.actions.skipForwardFrame', 1)"
                @click="if (!timeline.isPlaying.value) timeline.stepPlayback();"
            >
                <template #icon>
                    <PhSkipForward />
                </template>
            </Button>
        </ButtonGroup>
    </template>
</template>

<script lang="ts" setup>
import { useProject } from '@/stores/useProject';
import { PhPause, PhPlay, PhSkipBack, PhSkipForward } from '@phosphor-icons/vue';
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
