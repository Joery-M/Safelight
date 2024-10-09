<template>
    <Panel>
        <template #header>
            <RouterLink to="/dev/">
                <Button>
                    <template #icon>
                        <PhArrowLeft />
                    </template>
                </Button>
            </RouterLink>
        </template>

        <p class="flex items-center gap-2">
            <Checkbox v-model="autoDemux" binary input-id="autoDemux" />
            <label for="autoDemux">Auto start demuxing</label>
        </p>
        <div class="flex items-center gap-3">
            <Button
                :disabled="!(!fileDialog.files.value || fileDialog.files.value.length == 0)"
                @click="fileDialog.open()"
            >
                <PhUpload />&nbsp; Upload
            </Button>
            <Button :disabled="progress !== 'Loaded' || !demuxFn" @click="if (demuxFn) demuxFn();">
                Demux
            </Button>
        </div>
        <p>
            Progress: {{ progress }}
            <template v-if="startTime != undefined && endTime != undefined">
                , {{ endTime - startTime }}ms
            </template>
        </p>
        <div :class="{ slow: clock - average > 1 }" class="slow-indicator"></div>
        <p>
            {{ clock }}, <br />
            {{ average }}
        </p>
        <ul>
            <li v-for="track in trackNum.entries()" :key="track[0]">
                {{ track[0] }}: {{ track[1] }}
            </li>
        </ul>
    </Panel>
</template>

<script lang="ts" setup>
import { PhArrowLeft, PhUpload } from '@phosphor-icons/vue';
import { VideoDemuxer, type DemuxedVideoTrack } from '@safelight/shared/Decoder/Video/VideoDemuxer';
import { useFileDialog } from '@vueuse/core';
import { useAverage } from '@vueuse/math';
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

const clock = ref(0);
let lastTick = performance.now();
let animFrameCallback: number | undefined;
const measurements = reactive<number[]>([]);
const average = useAverage(measurements);

function tick(now: DOMHighResTimeStamp) {
    clock.value = now - lastTick;
    lastTick = performance.now();
    animFrameCallback = requestAnimationFrame(tick);

    measurements.push(clock.value);
    while (measurements.length > 10000) {
        measurements.shift();
    }
}
animFrameCallback = requestAnimationFrame(tick);

onUnmounted(() => {
    if (animFrameCallback) cancelAnimationFrame(animFrameCallback);
});
const tracks = ref<DemuxedVideoTrack[]>();
const trackNum = reactive(new Map<number, number>());

fileDialog.onChange((fileList) => {
    if (!fileList || fileList.length == 0) return;

    const file = fileList.item(0);
    if (file) {
        loadFile(file);
    }
});

let demuxFn: (() => void | Promise<void>) | undefined = undefined;

async function loadFile(source: File) {
    endTime.value = undefined;
    startTime.value = undefined;
    progress.value = 'Processing';
    const demuxer = new VideoDemuxer();
    const success = await demuxer.loadFile(source);
    if (success) {
        progress.value = 'Loaded';
        trackNum.clear();
        demuxFn = async () => {
            startTime.value = Date.now();
            progress.value = 'Start demux';
            const res = demuxer.demux();
            progress.value = `Demuxed ${res !== undefined}`;
            res?.subscribe({
                complete() {
                    endTime.value = Date.now();
                },
                next: (val) => {
                    if (Array.isArray(val)) {
                        val.forEach((val) => {
                            if (trackNum.has(val.trackIndex)) {
                                trackNum.set(
                                    val.trackIndex,
                                    (trackNum.get(val.trackIndex) ?? 0) + 1
                                );
                            }
                        });
                    } else if (val.type == 'video' || val.type == 'audio') {
                        trackNum.set(val.trackIndex, 0);
                        console.log(val);
                    }
                }
            });
            // tracks.value = res;
            fileDialog.reset();
        };
        if (autoDemux.value) {
            demuxFn();
        }
    } else {
        progress.value = 'No demuxer found for this file';
        fileDialog.reset();
    }
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
