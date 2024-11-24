<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button icon="ph ph-house" />
            </RouterLink>
        </template>
        <template #content>
            <div class="w-72">
                <Select
                    v-model="activeSource"
                    class="w-64"
                    :options="sources"
                    option-label="label"
                />
                <br />
                <br />
                <label>Effects</label>
                <Listbox :options="availableTransforms"></Listbox>
            </div>
            <div class="absolute right-4 top-4 size-min">
                <canvas ref="canvas" class="max-w-2xl"></canvas>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { type DaguerreoTransformEffect, Daguerreo } from '@safelight/daguerreo';
import {
    CatTestSource,
    GifTestSource,
    GradientTestSource
} from '@safelight/daguerreo/sources/TestSource.js';
import { tryOnMounted, useRafFn, watchImmediate } from '@vueuse/core';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Listbox from 'primevue/listbox';
import Select from 'primevue/select';
import { ref, useTemplateRef } from 'vue';

const availableTransforms: DaguerreoTransformEffect[] = [];

let daguerreo = new Daguerreo();

const sources = [
    { label: 'gradient', value: () => GradientTestSource() },
    { label: 'cat', value: () => CatTestSource() },
    { label: 'gif', value: () => GifTestSource() }
];
const activeSource = ref(sources[1]);

const canvas = useTemplateRef('canvas');

tryOnMounted(() => {
    if (!canvas.value) return;

    const ctx = canvas.value.getContext('2d');

    if (!ctx) return;

    watchImmediate(activeSource, async () => {
        daguerreo = new Daguerreo();
        daguerreo.setSource(activeSource.value?.value());
    });

    let counter = 0;

    useRafFn(
        async () => {
            const value = await daguerreo.process({
                frame: counter,
                frameDuration: 1000 / 60,
                width: 1280,
                height: 720
            });

            canvas.value!.width = value.data.width;
            canvas.value!.height = value.data.height;
            ctx.putImageData(value.data, 0, 0);
            counter++;
        },
        { fpsLimit: 60 }
    );
});
</script>
