<template>
    <template v-if="timeline">
        <Timecode />
        <ButtonGroup>
            <Button
                severity="secondary"
                aria-label="Skip back 1 frame"
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
                aria-label="Skip forward 1 frame"
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
import ButtonGroup from 'primevue/buttongroup';

const { project } = CurrentProject;
const timeline = computed(() =>
    project.value?.timeline.value?.isSimpleTimeline() ? project.value.timeline.value : undefined
);

function playPause(ev: MouseEvent) {
    if (timeline.value) {
        if (timeline.value.isPlaying.value) {
            timeline.value.stopPlayback(ev.ctrlKey);
        } else {
            timeline.value.startPlayback();
        }
    }
}
</script>
