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
                <SelectButton
                    v-model="quality"
                    :options="['rough', 'preview', 'final']"
                    class="mt-4 block"
                    @value-change="renderIfNeeded()"
                />
                <h3>Effects</h3>
                <div id="effect-list" class="h-80 max-w-screen-sm flex gap-4">
                    <Listbox
                        :options="availableTransforms"
                        data-key="name"
                        option-label="name"
                        filter
                        :filter-fields="['name']"
                        @update:model-value="(ev) => (transformSelectedFromLibrary = ev)"
                        @option-dblclick="
                            (ev) => {
                                if (ev)
                                    activeTransforms.push({
                                        id: uuidv4(),
                                        transform: markRaw(ev.value.transform())
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
                                            transform: markRaw(
                                                transformSelectedFromLibrary.transform()
                                            )
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
                <table v-if="selectedActiveTransform" class="mb-2">
                    <thead>
                        <tr>
                            <th class="w-36">Property</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(opt, key) in selectedActiveTransform.transform.properties"
                            :key="key"
                        >
                            <td>
                                {{ key }}
                            </td>
                            <td v-if="opt.type === 'number'">
                                <InputNumber
                                    v-if="!opt.meta?.slider"
                                    :model-value="opt.displayValue()"
                                    :max-fraction-digits="opt.meta?.integerOnly ? 0 : 10"
                                    :min="opt.meta?.min"
                                    :max="opt.meta?.max"
                                    :step="opt.meta?.step"
                                    @value-change="
                                        opt.setValue($event);
                                        renderIfNeeded();
                                    "
                                />
                                <Slider
                                    v-else
                                    :model-value="opt.displayValue()"
                                    :min="opt.meta?.min"
                                    :max="opt.meta?.max"
                                    :step="opt.meta?.step"
                                    @value-change="
                                        opt.setValue($event);
                                        renderIfNeeded();
                                    "
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Playback controls -->
            <div class="right-4 top-4 size-min xl:absolute">
                <canvas ref="canvas" class="max-w-2xl"></canvas>
                <p>P: {{ times.process }}, C: {{ times.composite }}, T: {{ times.total }}</p>
                <Slider
                    v-model="frameNum"
                    class="mb-5 mt-3"
                    :step="1"
                    :max="60 * 10"
                    @value-change="renderIfNeeded()"
                />
                <div class="flex justify-center gap-2">
                    <InputNumber
                        v-model="frameNum"
                        :max-fraction-digits="0"
                        size="small"
                        @value-change="renderIfNeeded()"
                    />
                    <ButtonGroup>
                        <Button
                            icon="ph ph-skip-back"
                            @click="
                                frameNum--;
                                renderFrame();
                            "
                        />
                        <Button
                            :icon="'ph ' + (isPaused ? 'ph-play' : 'ph-pause')"
                            @click="isPaused = !isPaused"
                        />
                        <Button
                            icon="ph ph-skip-forward"
                            @click="
                                frameNum += 1;
                                renderFrame();
                            "
                        />
                    </ButtonGroup>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import {
    Daguerreo,
    type DaguerreoTransformEffect,
    type QualitySetting
} from '@safelight/daguerreo';
import {
    CatTestSource,
    GifTestSource,
    GradientTestSource
} from '@safelight/daguerreo/sources/TestSource';
import {
    FlipTransform,
    GenericTransform,
    RotateTransform,
    ScaleTransform,
    TranslateTransform
} from '@safelight/daguerreo/transformers/TranslateTransform';
import { tryOnMounted, useRafFn, watchImmediate } from '@vueuse/core';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import Listbox from 'primevue/listbox';
import Select from 'primevue/select';
import SelectButton from 'primevue/selectbutton';
import Slider from 'primevue/slider';
import { v4 as uuidv4 } from 'uuid';
import { markRaw, reactive, ref, shallowReactive, shallowRef, useTemplateRef, type Raw } from 'vue';

const availableTransforms = shallowReactive<LibraryTransformEntry[]>([
    { name: 'dg-translate-transform', transform: () => TranslateTransform() },
    { name: 'dg-rotate-transform', transform: () => RotateTransform() },
    { name: 'dg-scale-transform', transform: () => ScaleTransform() },
    { name: 'dg-flip-transform', transform: () => FlipTransform() },
    { name: 'dg-transform', transform: () => GenericTransform() }
]);
const activeTransforms = reactive<ActiveTransformEntry[]>([]);

let daguerreo = new Daguerreo();

const sources = [
    { label: 'gradient', name: 'gradient-test-source', value: () => GradientTestSource() },
    { label: 'cat', name: 'cat-test-source', value: () => CatTestSource() },
    { label: 'gif', name: 'gif-test-source', value: () => GifTestSource() }
];
const activeSource = ref(sources[0]);

const transformSelectedFromLibrary = shallowRef<LibraryTransformEntry>();
const selectedActiveTransform = shallowRef<ActiveTransformEntry>();

const canvas = useTemplateRef('canvas');
let ctx: CanvasRenderingContext2D | null = null;

const isPaused = ref(false);
const frameNum = ref(0);
const quality = ref<QualitySetting>('final');

const times = reactive({
    process: '',
    composite: '',
    total: ''
});

tryOnMounted(() => {
    if (!canvas.value) return;

    ctx = canvas.value.getContext('2d');

    watchImmediate(activeSource, () => {
        daguerreo.setSource(activeSource.value?.value());
        frameNum.value = 0;
        renderFrame();
    });

    // Render at (at best) 60fps
    const raf = useRafFn(
        () => {
            frameNum.value++;
            renderFrame();
        },
        { fpsLimit: 60 }
    );
    watchImmediate(isPaused, () => (isPaused.value ? raf.pause() : raf.resume()));

    // Set transforms
    watchImmediate(activeTransforms, (transforms) => {
        while (daguerreo.effects.shift());

        for (const transform of transforms) {
            daguerreo.addEffect(transform.transform);
        }

        renderIfNeeded();
    });
});

function renderIfNeeded() {
    if (isPaused.value) {
        renderFrame();
    }
}

async function renderFrame() {
    if (!ctx) return;

    const start = performance.now();
    const value = await daguerreo.process({
        frame: frameNum.value,
        frameDuration: 1000 / 60,
        width: 1280,
        height: 720,
        quality: quality.value
    });
    const endProcess = performance.now();

    // Set preview canvas size
    if (canvas.value?.width !== value.width || canvas.value.height !== value.height) {
        canvas.value!.width = value.width;
        canvas.value!.height = value.height;
    }
    ctx.reset();
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalAlpha = value.opacity;
    ctx.globalCompositeOperation = value.compositeOperation;
    ctx.setTransform(value.matrix);
    ctx.drawImage(value.image, 0, 0);
    value.image.close();
    const endComposite = performance.now();

    times.process = (endProcess - start).toFixed(2);
    times.composite = (endComposite - endProcess).toFixed(2);
    times.total = (endComposite - start).toFixed(2);
}

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
    transform: Raw<DaguerreoTransformEffect>;
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
