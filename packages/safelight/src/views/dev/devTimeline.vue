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
            <canvas ref="canvas" style="width: 100%; height: 200px" />
            <input v-model="invertScrollAxes" type="checkbox" />
            <label> Trackpad mode </label>
            <div>
                <input
                    v-model.number="testVal.start"
                    type="range"
                    :max="500"
                    style="width: 250px"
                />
                <input v-model.number="testVal.start" type="number" style="width: 75px" />
                <br />
                <input v-model.number="testVal.end" type="range" :max="500" style="width: 250px" />
                <input v-model.number="testVal.end" type="number" style="width: 75px" />
            </div>
            <div>
                <button @click="manager?.manager?.zoom(100)">Zoom in</button>
                <button @click="manager?.manager?.zoom(-100)">Zoom out</button>
                <button @click="manager?.manager?.renderAll()">Re-render</button>
            </div>
            <div v-if="manager">
                <input
                    v-model.number="manager.manager.viewport.start"
                    type="range"
                    :max="2000"
                    style="width: 250px"
                />
                <input
                    v-model.number="manager.manager.viewport.start"
                    type="number"
                    style="width: 75px"
                />
                <br />
                <input
                    v-model.number="manager.manager.viewport.end"
                    type="range"
                    :max="2000"
                    style="width: 250px"
                />
                <input
                    v-model.number="manager.manager.viewport.end"
                    type="number"
                    style="width: 75px"
                />
            </div>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import { createTimelineManager, type CreateTimelineFn } from '@safelight/timeline';
import { TimelineLayer } from '@safelight/timeline/elements/TimelineLayer';
import { VideoTimelineElement } from '@safelight/timeline/elements/VideoTimelineElement';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { onMounted, reactive, ref, watch } from 'vue';
import { RouterLink } from 'vue-router/auto';

const invertScrollAxes = ref(true);

const canvas = ref<HTMLCanvasElement>();

const testVal = reactive({
    start: 0,
    end: 100
});
const manager = ref<CreateTimelineFn>();
onMounted(() => {
    if (canvas.value) {
        manager.value = createTimelineManager(canvas.value);

        const layer1 = new TimelineLayer();
        const layer2 = new TimelineLayer();

        const videoElem = new VideoTimelineElement();
        layer1.elements.add(videoElem);

        manager.value!.addLayer(layer1);
        manager.value!.addLayer(layer2);

        watch(
            testVal,
            ({ end, start }) => {
                videoElem.end.value = end;
                videoElem.start.value = start;
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

<route lang="json">
{ "path": "/dev/timeline", "name": "Timeline" }
</route>
