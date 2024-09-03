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
            <div>
                <input type="range" v-model.number="testVal.end" :max="500" />
                <br />
                <input type="range" v-model.number="testVal.layer" :max="500" />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import { createTimelineManager } from '@safelight/timeline';
import { VideoTimelineElement } from '@safelight/timeline/elements/VideoTimelineElement';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Slider from 'primevue/slider';
import { onMounted, reactive, ref, watch } from 'vue';
import { RouterLink } from 'vue-router/auto';

const invertScrollAxes = ref(true);

const canvas = ref<HTMLCanvasElement>();

const testVal = reactive({
    end: 100,
    layer: 100
});

onMounted(() => {
    if (canvas.value) {
        const manager = createTimelineManager(canvas.value);

        const videoElem = new VideoTimelineElement();
        manager.addElement(videoElem);

        watch(
            testVal,
            ({ end, layer }) => {
                videoElem.end = end;
                videoElem.layer = layer;
            },
            { immediate: true, deep: true }
        );
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
