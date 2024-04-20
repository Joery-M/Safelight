<template>
    <div v-if="project.isLoaded" class="flex h-full w-full flex-col">
        <Toolbar
            :pt="{
                root: {
                    class: 'p-0'
                }
            }"
        >
            <template #start>
                <Menubar :pt="{ root: { class: 'border-none' } }" :model="menuItems">
                    <template #itemicon="{ item: { icon } }">
                        <component :is="icon" v-if="icon" size="18" class="pr-1" />
                    </template>
                </Menubar>
            </template>
            <template #center>
                <InplaceRename
                    v-if="CurrentProject.project.value"
                    :value="CurrentProject.project.value?.name.value"
                    @change="
                        (newName) => {
                            CurrentProject.project.value!.name.value = newName;
                            CurrentProject.save();
                        }
                    "
                />
            </template>
        </Toolbar>
        <Splitter layout="vertical" class="vertSlitter" @resize="clearSelection()">
            <SplitterPanel>
                <Splitter @resize="clearSelection()">
                    <SplitterPanel>
                        <TabView class="flex h-full flex-col">
                            <TabPanel>
                                <template #header>
                                    <div class="flex items-center gap-2">
                                        <PhFolders size="20" />
                                        <span class="white-space-nowrap font-bold"> Library </span>
                                    </div>
                                </template>
                                <Library />
                            </TabPanel>
                        </TabView>
                    </SplitterPanel>
                    <SplitterPanel>
                        <Monitor
                            v-if="CurrentProject.project.value?.timeline"
                            :timeline="CurrentProject.project.value?.timeline"
                            class="min-h-100 w-full"
                        />
                    </SplitterPanel>
                </Splitter>
            </SplitterPanel>
            <SplitterPanel :size="40">
                <Timeline class="h-full w-full" />
            </SplitterPanel>
        </Splitter>
    </div>
    <ConfirmDialog group="noProjectDialog"> </ConfirmDialog>
</template>

<script setup lang="ts">
import { router } from '@/main';
import { PhFile } from '@phosphor-icons/vue';
import { Storage } from '@safelight/shared/base/Storage';
import ConfirmDialog from 'primevue/confirmdialog';
import type { MenuItem } from 'primevue/menuitem';
import SplitterPanel from 'primevue/splitterpanel';
import Toolbar from 'primevue/toolbar';
import { useConfirm } from 'primevue/useconfirm';

const project = useProject();

const projectErrorDialog = useConfirm();

const menuItems: MenuItem[] = [
    {
        label: 'File',
        icon: PhFile as any,
        items: [
            {
                label: 'Exit',
                disabled: false,
                command: async () => {
                    await CurrentProject.save();
                    router.push('/projects');
                }
            }
        ]
    }
];

onMounted(async () => {
    await router.isReady();
    if (!project.isLoaded) {
        const lastId = useSessionStorage('project', undefined).value;
        if (lastId) {
            Storage.getProjects().then((projects) => {
                const projectFromId = projects.find((p) => p.id == lastId);
                if (projectFromId) {
                    CurrentProject.openProject(projectFromId, false /* Already here */);
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
        CurrentProject.save();
        project.$dispose();
    }
});
</script>

<style lang="scss" scoped>
.vertSlitter {
    height: 100%;
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
