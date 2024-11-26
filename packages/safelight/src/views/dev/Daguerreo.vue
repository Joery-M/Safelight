<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev">
                <Button icon="ph ph-house" />
            </RouterLink>
        </template>
        <template #content>
            <div class="w-full max-w-screen-md">
                <h3>Source</h3>
                <Select
                    v-model="activeSource"
                    class="w-64"
                    :options="sources"
                    option-label="label"
                />
                <p>{{ canvasWidth }} x {{ canvasHeight }}</p>
                <h3>Effects</h3>
                <div id="effect-list" class="flex h-80 max-w-screen-sm gap-4">
                    <Listbox
                        ref="allTransformsList"
                        :options="availableTransforms"
                        data-key="name"
                        option-label="name"
                        filter
                        :filter-fields="['name']"
                        @update:model-value="(ev) => (transformSelectedFromLibrary = ev?.transform)"
                        @option-dblclick="
                            (ev) => {
                                if (ev)
                                    activeTransforms.push({
                                        id: uuidv4(),
                                        transform: ev.value.transform()
                                    });
                            }
                        "
                    />
                    <div class="flex items-center justify-center">
                        <Button
                            icon="ph ph-caret-right"
                            severity="secondary"
                            :disabled="!transformSelectedFromLibrary"
                            @click="
                                () => {
                                    if (transformSelectedFromLibrary)
                                        activeTransforms.push({
                                            id: uuidv4(),
                                            transform: transformSelectedFromLibrary()
                                        });
                                }
                            "
                        />
                    </div>
                    <Listbox
                        v-model="selectedActiveTransform"
                        :options="activeTransforms"
                        data-key="id"
                        empty-message="No effects added"
                    >
                        <template #option="{ option }">
                            {{ option.transform.name }}
                        </template>
                    </Listbox>
                    <div class="flex flex-col items-center justify-center gap-2">
                        <Button
                            icon="ph ph-caret-up"
                            severity="secondary"
                            :disabled="!selectedActiveTransform"
                            @click="
                                () => {
                                    if (selectedActiveTransform) {
                                        const index =
                                            activeTransforms.indexOf(selectedActiveTransform);
                                        if (index >= 0) {
                                            arrayMove(activeTransforms, index, index - 1);
                                        }
                                    }
                                }
                            "
                        />
                        <Button
                            icon="ph ph-caret-down"
                            severity="secondary"
                            :disabled="!selectedActiveTransform"
                            @click="
                                () => {
                                    if (selectedActiveTransform) {
                                        const index =
                                            activeTransforms.indexOf(selectedActiveTransform);
                                        if (index >= 0) {
                                            arrayMove(activeTransforms, index, index + 1);
                                        }
                                    }
                                }
                            "
                        />
                        <Button
                            icon="ph ph-trash"
                            severity="secondary"
                            :disabled="!selectedActiveTransform"
                            @click="
                                () => {
                                    if (
                                        selectedActiveTransform &&
                                        activeTransforms.indexOf(selectedActiveTransform) >= 0
                                    ) {
                                        activeTransforms.splice(
                                            activeTransforms.indexOf(selectedActiveTransform),
                                            1
                                        );
                                        selectedActiveTransform = undefined;
                                    }
                                }
                            "
                        />
                    </div>
                </div>
                <h3>Effect options</h3>
                <p>
                    {{ selectedActiveTransform?.id }}
                </p>
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
} from '@safelight/daguerreo/sources/TestSource';
import {
    FlipTransform,
    RotateTransform,
    ScaleTransform,
    TranslateTransform
} from '@safelight/daguerreo/transformers/TranslateTransform';
import { tryOnMounted, useRafFn, watchImmediate } from '@vueuse/core';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Listbox from 'primevue/listbox';
import Select from 'primevue/select';
import { v4 as uuidv4 } from 'uuid';
import { ref, shallowReactive, shallowRef, useTemplateRef } from 'vue';

const availableTransforms = shallowReactive<LibraryTransformEntry[]>([
    { name: 'dg-translate-transform', transform: () => TranslateTransform() },
    { name: 'dg-rotate-transform', transform: () => RotateTransform() },
    { name: 'dg-scale-transform', transform: () => ScaleTransform() },
    { name: 'dg-flip-transform', transform: () => FlipTransform() }
]);
const activeTransforms = shallowReactive<ActiveTransformEntry[]>([]);

let daguerreo = new Daguerreo();

const sources = [
    { label: 'gradient', value: () => GradientTestSource() },
    { label: 'cat', value: () => CatTestSource() },
    { label: 'gif', value: () => GifTestSource() }
];
const activeSource = ref(sources[1]);

const allTransformsList = useTemplateRef('allTransformsList');
const transformSelectedFromLibrary = shallowRef<() => DaguerreoTransformEffect>();
const selectedActiveTransform = shallowRef<ActiveTransformEntry>();

const canvas = useTemplateRef('canvas');
const canvasWidth = ref<number>();
const canvasHeight = ref<number>();

tryOnMounted(() => {
    if (!canvas.value) return;

    const ctx = canvas.value.getContext('2d');

    if (!ctx) return;

    let counter = 0;

    watchImmediate(activeSource, () => {
        daguerreo.setSource(activeSource.value?.value());
        counter = 0;
    });

    // Render at (at best) 60fps
    useRafFn(
        async () => {
            const value = await daguerreo.process({
                frame: counter,
                frameDuration: 1000 / 60,
                width: 1280,
                height: 720
            });

            // Set preview canvas size
            if (canvas.value?.width !== value.width || canvas.value.height !== value.height) {
                canvas.value!.width = value.width;
                canvas.value!.height = value.height;
                canvasWidth.value = value.width;
                canvasHeight.value = value.height;
            }
            ctx.reset();
            ctx.setTransform(value.matrix);
            ctx.drawImage(value.image, 0, 0);
            value.image.close();
            counter++;
        },
        { fpsLimit: 60 }
    );

    // Set transforms

    watchImmediate(activeTransforms, (transforms) => {
        while (daguerreo.effects.shift());

        for (const transform of transforms) {
            daguerreo.addEffect(transform.transform);
        }
    });
});

/**
 * Move an element in an array in-place
 *
 * @source https://stackoverflow.com/a/5306832
 */
function arrayMove(arr: any[], old_index: number, new_index: number) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    while (old_index >= arr.length) {
        old_index -= arr.length;
    }
    while (new_index >= arr.length) {
        new_index -= arr.length;
    }

    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

interface LibraryTransformEntry {
    name: string;
    transform: () => DaguerreoTransformEffect;
}
interface ActiveTransformEntry {
    id: string;
    transform: DaguerreoTransformEffect;
}
</script>

<style lang="scss" scoped>
#effect-list .p-listbox {
    flex-grow: 1;
    width: 50%;
    :deep(.p-listbox-list-container) {
        max-height: 100% !important;
    }
}
</style>
