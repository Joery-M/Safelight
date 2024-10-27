<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button icon="ph ph-arrow-left" />
            </RouterLink>
        </template>
        <template #content>
            <canvas ref="canvas" style="width: 100%; height: 400px" />
            <template v-if="manager">
                <input v-model="manager.manager.invertScrollAxes.value" type="checkbox" />
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
                                manager.manager.maxViewWidth.value +
                                manager.manager.rightPadding.value
                            "
                            style="max-width: 500px"
                            @update:model-value="
                                (range) => {
                                    const [start, end] = Array.isArray(range)
                                        ? range
                                        : [range, range];

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
                        :max="
                            manager.manager.maxViewWidth.value + manager.manager.rightPadding.value
                        "
                        style="max-width: 500px"
                        @update:model-value="
                            (range) => {
                                const [start, end] = Array.isArray(range) ? range : [range, range];
                                console.log(start, end);

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
import { createTimelineManager, type CreateTimelineFn } from '@safelight/timeline';
import {
    TimelineCursorElement,
    TimelineGrid,
    TimelineLayer,
    TimelineScrollbarHoriz,
    VideoTimelineElement
} from '@safelight/timeline/elements';
import { watchImmediate } from '@vueuse/core';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Slider from 'primevue/slider';
import { computed, onMounted, reactive, ref, shallowReactive, shallowRef, watch } from 'vue';
import { RouterLink } from 'vue-router/auto';

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
const fpsMS = computed(() => 1000 / fps.value);

onMounted(() => {
    if (canvas.value) {
        manager.value = createTimelineManager(canvas.value);

        const layer1 = new TimelineLayer();
        const layer2 = new TimelineLayer();
        const layer3 = new TimelineLayer();
        const layer4 = new TimelineLayer();
        const layer5 = new TimelineLayer();
        const layer6 = new TimelineLayer();
        const layer7 = new TimelineLayer();
        const layer8 = new TimelineLayer();

        manager.value!.addLayer(layer1);
        manager.value!.addLayer(layer2);
        manager.value!.addLayer(layer3);
        manager.value!.addLayer(layer4);
        manager.value!.addLayer(layer5);
        manager.value!.addLayer(layer6);
        manager.value!.addLayer(layer7);
        manager.value!.addLayer(layer8);

        const grid = new TimelineGrid();
        const handle = new TimelineCursorElement();
        const scrollbarX = new TimelineScrollbarHoriz();

        watchImmediate(fpsMS, (f) => (handle.frameInterval.value = f));

        grid.steps.push(
            {
                interval: computed(() => fpsMS.value)
            },
            {
                interval: 100
            },
            {
                interval: 1000
            },
            {
                interval: 10000
            }
        );

        manager.value!.addElement(grid);
        manager.value!.addElement(handle);
        manager.value!.addElement(scrollbarX);

        items.forEach(({ item, layer }) => {
            item.frameInterval.value = fpsMS.value;
            item.layer.value = layer;
            manager.value!.addLayerItem(item);
        });

        watch(
            isItemActive,
            () => {
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const active = isItemActive[i];

                    if (active) {
                        if (!manager.value!.hasLayerItem(item.item)) {
                            manager.value!.addLayerItem(item.item);
                        }
                    } else {
                        if (manager.value!.hasLayerItem(item.item)) {
                            manager.value!.removeLayerItem(item.item);
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
{ "name": "Timeline" }
</route>
