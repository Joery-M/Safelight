<template>
    <Suspense v-if="project.isLoaded">
        <template #default>
            <Splitter layout="vertical" class="vertSlitter" @resize="clearSelection()">
                <SplitterPanel>
                    <Splitter @resize="clearSelection()">
                        <SplitterPanel>
                            <TabView class="flex h-full flex-col">
                                <TabPanel>
                                    <template #header>
                                        <div class="flex items-center gap-2">
                                            <PhFolders size="20" />
                                            <span class="white-space-nowrap font-bold">
                                                Library
                                            </span>
                                        </div>
                                    </template>
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
    </Suspense>
    <ConfirmDialog group="noProjectDialog"> </ConfirmDialog>
</template>

<script setup lang="ts">
import { router } from '@/main';
import { Storage } from '@safelight/shared/base/Storage';
import ConfirmDialog from 'primevue/confirmdialog';
import SplitterPanel from 'primevue/splitterpanel';
import { useConfirm } from 'primevue/useconfirm';

const project = useProject();

const projectErrorDialog = useConfirm();

onMounted(async () => {
    console.log('A');
    await router.isReady();
    console.log('B');
    if (!project.isLoaded) {
        const lastId = useSessionStorage('project', undefined).value;
        if (lastId) {
            Storage.getProjects().then((projects) => {
                const projectFromId = projects.find((p) => p.id == lastId);
                if (projectFromId) {
                    project.openProject(projectFromId);
                } else {
                    showNoProjectDialog();
                }
            });
        } else {
            showNoProjectDialog();
        }
    }
});

function showNoProjectDialog() {
    projectErrorDialog.require({
        group: 'noProjectDialog',
        header: 'No project loaded',
        message: 'No project has been loaded, go to project list?',
        reject() {
            router.push('/');
        },
        accept() {
            router.push('/projects');
        }
    });
}

function clearSelection() {
    document.getSelection()?.removeAllRanges();
}

onBeforeUnmount(() => {
    if (project.isLoaded) {
        project.save();
        project.$dispose();
    }
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
