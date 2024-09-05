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
            <br />
            <template v-if="manager">
                <div>
                    <button @click="manager?.manager?.zoom(100)">Zoom in</button>
                    <button @click="manager?.manager?.zoom(-100)">Zoom out</button>
                    <button @click="manager?.manager?.renderAll()">Re-render</button>
                </div>
                <template v-for="(item, i) of items" :key="i">
                    <div v-if="isItemActive[i]">
                        <p>{{ i }}</p>
                        <input
                            v-model.number="item.item.start.value"
                            type="number"
                            style="width: 75px"
                        />
                        <input
                            v-model.number="item.item.end.value"
                            type="number"
                            style="width: 75px"
                        />
                        <br />
                        <br />
                        <Slider
                            :range="true"
                            :model-value="[item.item.start.value, item.item.end.value]"
                            :max="
                                manager.manager._maxWidth.value + manager.manager.rightPadding.value
                            "
                            style="max-width: 500px"
                            @update:model-value="
                                ([start, end]) => {
                                    item.item.start.value = Math.min(start, end);
                                    item.item.end.value = Math.max(start, end);
                                }
                            "
                        />
                        <br />
                    </div>
                </template>
                <br />
                <div v-if="manager">
                    <input
                        v-model.number="manager.manager.viewport.start"
                        type="number"
                        style="width: 75px"
                    />
                    <input
                        v-model.number="manager.manager.viewport.end"
                        type="number"
                        style="width: 75px"
                    />
                    <br />
                    <br />
                    <Slider
                        :range="true"
                        :model-value="[
                            manager.manager.viewport.start,
                            manager.manager.viewport.end
                        ]"
                        :max="manager.manager._maxWidth.value + manager.manager.rightPadding.value"
                        style="max-width: 500px"
                        @update:model-value="
                            ([start, end]) => {
                                manager!.manager.viewport.start = Math.min(start, end);
                                manager!.manager.viewport.end = Math.max(start, end);
                            }
                        "
                    />
                    <br />
                </div>
                <div>
                    <input v-model.number="fps" type="number" style="width: 75px" />
                </div>
            </template>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { PhArrowLeft } from '@phosphor-icons/vue';
import { createTimelineManager, type CreateTimelineFn } from '@safelight/timeline';
import { TimelineGrid, TimelineLayer, VideoTimelineElement } from '@safelight/timeline/elements';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Slider from 'primevue/slider';
import { computed, onMounted, reactive, ref, shallowReactive, shallowRef, watch } from 'vue';
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
const manager = shallowRef<CreateTimelineFn>();
const fps = ref(60);

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

        const grid = new TimelineGrid();

        grid.steps.push({
            interval: computed(() => 1000 / fps.value)
        });
        grid.steps.push({
            interval: 100
        });
        grid.steps.push({
            interval: 1000
        });

        manager.value!.addElement(grid);

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
