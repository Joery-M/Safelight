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
                <input v-model="isItemActive[0]" type="checkbox" />
                <input v-model="isItemActive[1]" type="checkbox" />
                <input v-model="isItemActive[2]" type="checkbox" />
                <input v-model="isItemActive[3]" type="checkbox" />
                <input v-model="isItemActive[4]" type="checkbox" />
                <input v-model="isItemActive[5]" type="checkbox" />
            </div>
            <template v-for="(item, i) of items" :key="i">
                <div v-if="isItemActive[i]">
                    <p>{{ i }}</p>
                    <input
                        v-model.number="item.item.start.value"
                        type="range"
                        :max="1000"
                        style="width: 250px"
                    />
                    <input
                        v-model.number="item.item.start.value"
                        type="number"
                        style="width: 75px"
                    />
                    <br />
                    <input
                        v-model.number="item.item.end.value"
                        type="range"
                        :max="1000"
                        style="width: 250px"
                    />
                    <input v-model.number="item.item.end.value" type="number" style="width: 75px" />
                </div>
            </template>
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
import { onMounted, reactive, ref, shallowReactive, watch } from 'vue';
import { RouterLink } from 'vue-router/auto';

const invertScrollAxes = ref(true);

const canvas = ref<HTMLCanvasElement>();

const items = shallowReactive([
    { item: new VideoTimelineElement(), layer: 2 },
    { item: new VideoTimelineElement(), layer: 0 },
    { item: new VideoTimelineElement(), layer: 2 },
    { item: new VideoTimelineElement(), layer: 2 },
    { item: new VideoTimelineElement(), layer: 1 },
    { item: new VideoTimelineElement(), layer: 0 }
]);
const isItemActive = reactive([true, false, false, false, false, false]);
const manager = ref<CreateTimelineFn>();
onMounted(() => {
    if (canvas.value) {
        manager.value = createTimelineManager(canvas.value);

        const layer1 = new TimelineLayer();
        const layer2 = new TimelineLayer();
        const layer3 = new TimelineLayer();

        const layers = [layer1, layer2, layer3];

        manager.value!.addLayer(layer1);
        manager.value!.addLayer(layer2);
        manager.value!.addLayer(layer3);

        watch(
            isItemActive,
            () => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const active = isItemActive[i];

                    const layer = layers[item.layer];

                    if (active) {
                        if (!layer.elements.has(item.item)) {
                            layer.elements.add(item.item);
                        }
                    } else {
                        if (layer.elements.has(item.item)) {
                            layer.elements.delete(item.item);
                        }
                    }
                }
            },
            { immediate: true }
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
