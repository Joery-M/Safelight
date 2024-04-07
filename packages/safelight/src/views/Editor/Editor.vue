<template>
    <Splitter layout="vertical" class="vertSlitter">
        <SplitterPanel>
            <Splitter>
                <SplitterPanel>
                    <TabView>
                        <TabPanel>
                            <template #header>
                                <div class="flex items-center gap-2">
                                    <PhFolders size="20" />
                                    <span class="white-space-nowrap font-bold"> Library </span>
                                </div>
                            </template>
                            <!-- Dont break highlighting -->
                            <!-- eslint-disable-next-line prettier/prettier -->
                            <!-- prettier-ignore -->
                            <Library :media="(project.media as any)" />
                        </TabPanel>
                    </TabView>
                </SplitterPanel>
                <SplitterPanel>
                    <Monitor
                        v-if="project.activeTimeline"
                        :timeline="project.activeTimeline"
                        class="min-h-100 w-full"
                    />
                </SplitterPanel>
            </Splitter>
        </SplitterPanel>
        <SplitterPanel :size="40">
            <Timeline class="h-full w-full" />
        </SplitterPanel>
    </Splitter>
</template>

<script setup lang="ts">
import { useObservable } from '@vueuse/rxjs';
import SplitterPanel from 'primevue/splitterpanel';

const fileDialog = useFileDialog({
    accept: 'image/*,video/*'
});

const project = new SimpleProject();
const loading = ref(false);

fileDialog.onChange((fileList) => {
    if (!fileList) return;

    loading.value = true;
    const promises: Promise<void>[] = [];
    for (let i = 0; i < fileList.length; i++) {
        const file = fileList.item(i);

        if (file) promises.push(loadFile(file));
    }
    Promise.all(promises).finally(() => {
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
                    (m) => m.id.value == storingProcessing.value!.id
                );

                if (!existingMedia) {
                    const media = new Media(storingProcessing.value.id!);

                    project.media.push(media);
                    project.activeTimeline.createTimelineItem(media);
                }

                resolve();
            }
        });
    });
}

onBeforeUnmount(() => {
    // reset store, which currently tries to call 'this', trying to reference the store
    // project.$dispose();
});
</script>

<style lang="scss" scoped>
.vertSlitter {
    height: 100vh;
}
</style>

<route lang="json">
{
    "path": "/editor",
    "name": "Editor"
}
</route>
