<template>
    <Splitter layout="vertical" class="vertSlitter">
        <SplitterPanel>
            <Splitter>
                <SplitterPanel>
                    <TabView class="flex h-full flex-col">
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
                            <Library />
                        </TabPanel>
                    </TabView>
                </SplitterPanel>
                <SplitterPanel>
                    <Monitor
                        v-if="project.project?.timeline"
                        :timeline="project.project?.timeline"
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
import { Storage } from '@safelight/shared/base/Storage';
import SplitterPanel from 'primevue/splitterpanel';

// const fileDialog = useFileDialog({
//     accept: 'image/*,video/*'
// });

const project = useProject();
// const loading = ref(false);

/* fileDialog.onChange((fileList) => {
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
}); */

onBeforeUnmount(() => {
    // reset store, which currently tries to call 'this', trying to reference the store
    // project.$dispose();
    if (project.project) Storage.getStorage().SaveProject(project.project);
});
</script>

<style lang="scss" scoped>
.vertSlitter {
    height: 100vh;
}

:deep(.p-tabview-panels) {
    @apply flex-1;
}
:deep(.p-tabview-panel) {
    @apply h-full;
}
</style>

<route lang="json">
{
    "path": "/editor",
    "name": "Editor"
}
</route>
