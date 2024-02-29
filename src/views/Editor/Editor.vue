<template>
    <SLCard
        class="grid-place-items-center bg-primary/20 transition-500 pointer-events-none absolute left-0 top-0 grid h-full w-full"
        :style="{
            opacity: dropZone.isOverDropZone.value ? 1 : 0
        }"
    >
        <h1 class="font-sans">Just drop it gently</h1>
    </SLCard>
    <Monitor v-if="project.activeTimeline" :timeline="activeTimeline" class="min-h-100 w-full" />
    <SLButton @click="fileDialog.open">Load file</SLButton>
    <table>
        <tr v-for="media in project.media" :key="media.id">
            <td>
                {{ media.name }}
            </td>
            <td>
                <img :src="media.previewImage" />
            </td>
        </tr>
    </table>
    <Timeline class="h-96 w-full" />
</template>

<script setup lang="ts">
import MimeMatcher from 'mime-matcher';
import { generateMediaThumbnail } from '@/helpers/Video/GenerateMediaThumbnail';
import { getVideoInfo } from '@/helpers/Video/GetVideoInfo';

const fileDialog = useFileDialog({
    accept: 'image/*,video/*'
});

const dropZone = useDropZone(document.body, {
    onDrop(files) {
        files?.forEach(loadFile);
    },
    dataTypes(types) {
        return !types.some((val) => {
            return !new MimeMatcher('image/*', 'video/*').match(val);
        });
    }
});

const projectStore = useProject();
const { project, activeTimeline, getMediaFromID } = projectStore;

fileDialog.onChange((fileList) => {
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);

        if (file) loadFile(file);
    }
});

async function loadFile(file: File) {
    let media = project.createMedia(file);

    // Just to use the proxy from pinia
    media = project.media.find((m) => m.id == media.id)!;

    await generateMediaThumbnail(file).then((blob) => {
        const m = getMediaFromID(media.id);
        if (m) m.previewImage = blob;
    });

    await getVideoInfo(file).then((info) => {
        if (!info) return;
        const m = getMediaFromID(media.id);
        if (m) {
            m.fileInfo = info;
            m.duration = parseFloat(info.format.duration) * 1000;
        }
    });

    activeTimeline.createTimelineItem(media);
}

onBeforeUnmount(() => {
    // reset store, which currently tries to call 'this', trying to reference the store
    projectStore.$reset.call(projectStore);
});
</script>

<route lang="json">
{ "path": "/editor", "name": "Editor" }
</route>
