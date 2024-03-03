<template>
    <SLCard
        class="grid-place-items-center transition-500 bg-surface pointer-events-none absolute left-0 top-0 grid h-full w-full bg-opacity-20"
        :style="{
            opacity: dropZone.isOverDropZone.value ? 1 : 0
        }"
    >
        <h1 class="font-sans">Just drop it gently</h1>
    </SLCard>
    <Monitor
        v-if="project.activeTimeline"
        :timeline="project.activeTimeline"
        class="min-h-100 w-full"
    />
    <Library v-model="project.media" />
    <SLButton :loading @click="fileDialog.open">
        <template #icon>
            <PhUpload />
        </template>
        Load file
    </SLButton>
    <table>
        <tr v-for="media in project.media" :key="media.id">
            <td>
                {{ media.name }}
            </td>
            <td>
                <img :srcObject="media.previewImage" />
            </td>
        </tr>
    </table>
    <Timeline class="h-96 w-full" />
</template>

<script setup lang="ts">
import Media from '@/controllers/Media/Media';
import { PhUpload } from '@phosphor-icons/vue';
import { useObservable } from '@vueuse/rxjs';
import MimeMatcher from 'mime-matcher';
import type { UnwrapRef } from 'vue';

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

const project = useProject();
const loading = ref(false);

fileDialog.onChange((fileList) => {
    if (!fileList) return;

    loading.value = true;
    const promises: Promise<void>[] = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);

        if (file) promises.push(loadFile(file));
    }
    Promise.all(promises).then(() => {
        loading.value = false;
    });
});

function loadFile(file: File) {
    return new Promise<void>((resolve) => {
        const storingProcessing = useObservable(IdbMediaManager.storeMedia(file));
        watch(storingProcessing, (s) => {
            console.log(s?.type, s?.hashProgress);
        });

        watch(storingProcessing, () => {
            if (storingProcessing.value && storingProcessing.value.type == 'done') {
                const existingMedia = project.media.some(
                    (m) => m.id == storingProcessing.value!.id
                );

                if (!existingMedia) {
                    const media = new Media(storingProcessing.value.id!);

                    project.media.push(media as unknown as UnwrapRef<Media>);
                    project.activeTimeline.createTimelineItem(media);
                }

                resolve();
            }
        });
    });
}

onBeforeUnmount(() => {
    // reset store, which currently tries to call 'this', trying to reference the store
    project.$dispose();
});
</script>

<route lang="json">
{
    "path": "/editor",
    "name": "Editor"
}
</route>
