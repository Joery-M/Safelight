<template>
    <div v-if="CurrentProject.isLoaded.value" class="flex h-full w-full flex-col">
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
                        <component :is="icon" v-if="icon" class="pr-1" />
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
                        }
                    "
                />
            </template>
        </Toolbar>
        <Splitter layout="vertical" class="vertSlitter" @resize="clearSelection()">
            <SplitterPanel>
                <Splitter @resize="clearSelection()">
                    <SplitterPanel>
                        <TabView
                            class="flex h-full flex-col"
                            :pt="{
                                panelContainer: {
                                    class: 'flex-1'
                                }
                            }"
                        >
                            <TabPanel
                                :pt="{
                                    root: { class: 'h-full' }
                                }"
                            >
                                <template #header>
                                    <div class="flex items-center gap-2">
                                        <PhFolders />
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
import type { MenuItem } from 'primevue/menuitem';
import ConfirmDialog from 'primevue/confirmdialog';
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
                    await CurrentProject.beforeExit();
                    router.push('/projects');
                }
            }
        ]
    }
];

onMounted(async () => {
    await router.isReady();
    if (!CurrentProject.isLoaded.value) {
        const lastProject = CurrentProject.getSessionProject();
        console.log(lastProject);
        if (lastProject) {
            if (lastProject) {
                CurrentProject.openProject(lastProject, false /* Already here */);
            } else {
                showNoProjectDialog();
            }
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
            // TODO: idk actually. What should happen when no projects are loaded and the user just says "No"
            // Maybe use a regular Dialog, and add the "Yes" button to it
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
watch(
    CurrentProject.project,
    (project) => {
        if (project && CurrentProject.isLoaded.value) {
            project.onDeepChange.next();
        }
    },
    { deep: true }
);

onBeforeUnmount(async () => {
    if (CurrentProject.isLoaded.value) {
        await CurrentProject.beforeExit(false);
        project.$dispose();
    }
});
</script>

<style lang="scss" scoped>
.vertSlitter {
    height: 100%;
}
</style>

<route lang="json">
{
    "path": "/editor",
    "name": "Editor"
}
</route>
