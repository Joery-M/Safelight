<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button>
                    <template #icon>
                        <PhArrowLeft />
                    </template>
                </Button>
            </RouterLink>
        </template>
        <template #content>
            <canvas ref="canvas" />
            <input v-model="invertScrollAxes" type="checkbox" />
            <label> Trackpad mode </label>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import { createTimelineManager, VideoTimelineElement } from '@safelight/timeline/source';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router/auto';

const invertScrollAxes = ref(true);

const canvas = ref<HTMLCanvasElement>();
onMounted(() => {
    if (canvas.value) {
        const manager = createTimelineManager(canvas.value);

        const videoElem = new VideoTimelineElement();
        manager.timelineElements.add(videoElem);

        console.log(manager);
    }
});
</script>

<style>
html,
body {
    overscroll-behavior-x: none;
}
</style>

<style scoped>
:deep(#horizontalContainer) {
    height: 100%;
}
</style>

<route lang="json">
{ "path": "/dev/timeline" }
</route>
