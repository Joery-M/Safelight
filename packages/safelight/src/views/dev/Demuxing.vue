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
        <p>{{ clock }}</p>
        <template v-if="tracks">
            <ol>
                <li v-for="track in tracks" :key="track.id">
                    {{ track.codec }}, {{ track.width }}x{{ track.height }}
                    <pre>{{ track.segments }}</pre>
                </li>
            </ol>
        </template>
    </Panel>
</template>

<script lang="ts" setup>
import { PhArrowLeft, PhUpload } from '@phosphor-icons/vue';
import { VideoDemuxer, type DemuxedVideoTrack } from '@safelight/shared/Decoder/Video/VideoDemuxer';
import { useFileDialog, useIntervalFn } from '@vueuse/core';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Panel from 'primevue/panel';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const fileDialog = useFileDialog({
    accept: 'video/*'
});

const progress = ref('No file');
const autoDemux = ref(false);
const startTime = ref<number>();
const endTime = ref<number>();

const clock = ref(0);
useIntervalFn(() => {
    clock.value++;
}, 100);
const tracks = ref<DemuxedVideoTrack[]>();

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
        demuxFn = async () => {
            startTime.value = Date.now();
            progress.value = 'Start demux';
            const res = await demuxer.demux();
            progress.value = `Demuxed ${res !== undefined}`;
            tracks.value = res;
            fileDialog.reset();
            endTime.value = Date.now();
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
