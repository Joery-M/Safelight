<template>
    <Panel>
        <template #header>
            <RouterLink to="/dev/">
                <Button icon="i-ph-arrow-left" />
            </RouterLink>
        </template>

        <p class="flex items-center gap-2">
            <Checkbox v-model="autoDemux" binary input-id="autoDemux" />
            <label for="autoDemux">Auto start demuxing</label>
        </p>
        <div class="flex items-center gap-3">
            <Button
                :disabled="!(!fileDialog.files.value || fileDialog.files.value.length == 0)"
                icon="i-ph-upload"
                label="Upload"
                @click="fileDialog.open()"
            />
            <Button :disabled="progress !== 'Loaded'" @click="demux()"> Demux </Button>
            <Button :disabled="progress !== 'Loaded'" @click="demuxToStorage()">
                Demux to storage
            </Button>
        </div>
        <p>
            Progress: {{ progress }}
            <template v-if="startTime != undefined && endTime != undefined">
                , {{ endTime - startTime }}ms
            </template>
        </p>
        <div
            :class="{ slow: useAbs(averageShort - average).value > 1 }"
            class="slow-indicator"
        ></div>
        <p>
            Current: {{ useRound(1000 / averageShort) }}<br />
            <span @click="measurements = []">Average: {{ useRound(1000 / average) }}</span>
        </p>
        <ul>
            <li v-for="track in trackNum.entries()" :key="track[0]">
                {{ track[0] }}: {{ track[1] }}
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts" setup>
import { Storage } from '@safelight/shared/base/Storage';
import { FileDemuxer } from '@safelight/shared/Demuxer/FileDemuxer';
import { IndexedDbStorageController } from '@safelight/shared/Storage/LocalStorage/IndexedDbStorage';
import MediaManager from '@safelight/shared/Storage/MediaManager';
import { useFileDialog } from '@vueuse/core';
import { useAbs, useAverage, useRound } from '@vueuse/math';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Panel from 'primevue/panel';
import { onUnmounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';

const fileDialog = useFileDialog();

const progress = ref('No file');
const autoDemux = ref(false);
const startTime = ref<number>();
const endTime = ref<number>();

let lastTick = performance.now();
let animFrameCallback: number | undefined;
const measurementsShort = reactive<number[]>([]);
const measurements = ref<number[]>([]);
const average = useAverage(measurements);
const averageShort = useAverage(measurementsShort);

function tick(now: DOMHighResTimeStamp) {
    const tickTime = now - lastTick;
    lastTick = now;
    animFrameCallback = requestAnimationFrame(tick);

    measurementsShort.push(tickTime);
    while (measurementsShort.length > 100) {
        measurementsShort.shift();
    }
    measurements.value.push(tickTime);
    while (measurements.value.length > 10000) {
        measurements.value.shift();
    }
}
animFrameCallback = requestAnimationFrame(tick);

onUnmounted(() => {
    if (animFrameCallback) cancelAnimationFrame(animFrameCallback);
});
const trackNum = reactive(new Map<number, number>());

fileDialog.onChange((fileList) => {
    if (!fileList || fileList.length == 0) return;

    const file = fileList.item(0);
    if (file) {
        loadFile(file);
    }
});

let demuxer: FileDemuxer;

async function loadFile(source: File) {
    endTime.value = undefined;
    startTime.value = undefined;
    progress.value = 'Processing';
    demuxer = new FileDemuxer();
    const success = await demuxer.loadFile(source);
    if (success) {
        progress.value = 'Loaded';
        trackNum.clear();
        if (autoDemux.value) {
            demux();
        }
    } else {
        progress.value = 'No demuxer found for this file';
        fileDialog.reset();
    }
}

function demux() {
    startTime.value = Date.now();
    progress.value = 'Start demux';
    const res = demuxer.demux();
    progress.value = `Demuxed ${res !== undefined}`;
    res?.subscribe({
        complete() {
            endTime.value = Date.now();
            progress.value = `Done`;
            fileDialog.reset();
        },
        next: (val) => {
            if (val.type == 'video' || val.type == 'audio') {
                trackNum.set(val.trackIndex, 0);
                console.log(val);
            } else if (val.type == 'chunks') {
                val.chunks.forEach((val) => {
                    if (trackNum.has(val.trackIndex)) {
                        trackNum.set(val.trackIndex, (trackNum.get(val.trackIndex) ?? 0) + 1);
                    }
                });
            }
        }
    });
}

function demuxToStorage() {
    const source = fileDialog.files.value?.[0];
    if (!source) return;
    startTime.value = Date.now();
    progress.value = 'Start demux';
    Storage.setStorage(new IndexedDbStorageController());
    MediaManager.storeMedia(source)
        .then(() => {
            endTime.value = Date.now();
            progress.value = `Done`;
            fileDialog.reset();
        })
        .catch((err) => {
            console.error(err);
        });
}
</script>

<style lang="scss" scoped>
.slow-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: green;
    &.slow {
        background-color: red;
    }
}
</style>
