<template>
    <template v-if="CurrentProject.isLoaded.value">
        <Toolbar
            :pt="{
                root: {
                    class: 'p-0 rounded-none'
                }
            }"
        >
            <template #start>
                <Menubar
                    :pt="{ root: { class: 'border-none' }, submenu: { class: 'z-50' } }"
                    :model="menuItems"
                >
                    <template #itemicon="{ item: { icon } }">
                        <component :is="icon" v-if="icon" />
                    </template>
                </Menubar>
            </template>
            <template #center>
                <InplaceRename
                    v-if="CurrentProject.project.value"
                    :value="CurrentProject.project.value?.name.value"
                    @change="
                        (newName: string) => {
                            CurrentProject.project.value!.name.value = newName;
                        }
                    "
                />
            </template>
        </Toolbar>
        <!-- Just default data for the first split -->
        <PanelContainer :config="{ splitDirection: 'vertical', split: editor.activePanels }" />
    </template>
    <ConfirmDialog group="noProjectDialog"> </ConfirmDialog>
</template>

<script setup lang="ts">
import InplaceRename from '@/components/InplaceRename.vue';
import PanelContainer from '@/components/Panels/PanelContainer.vue';
import { router } from '@/main';
import { CurrentProject } from '@/stores/currentProject';
import { useEditor } from '@/stores/useEditor';
import { useProject } from '@/stores/useProject';
import { PhFile, PhGear, PhSignOut } from '@phosphor-icons/vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';
import Toolbar from 'primevue/toolbar';
import { useConfirm } from 'primevue/useconfirm';
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent, onBeforeUnmount, onMounted, watch } from 'vue';

const project = useProject();
const editor = useEditor();

editor.AddDefaultPanels();

const projectErrorDialog = useConfirm();
const dialog = useDialog();

const menuItems: MenuItem[] = [
    {
        label: 'File',
        icon: PhFile as any,
        items: [
            {
                label: 'Settings',
                icon: PhGear as any,
                disabled: false,
                command: () => {
                    const settingsComponent = defineAsyncComponent(
                        () => import('../../components/Menu/Settings/Settings.vue')
                    );
                    dialog.open(settingsComponent, {
                        props: {
                            header: 'Settings',
                            style: {
                                width: '75vw',
                                height: '80vh'
                            },
                            pt: { content: { style: { height: '100%' } } },
                            breakpoints: {
                                '960px': '80vw',
                                '640px': '90vw'
                            },
                            modal: true,
                            draggable: false
                        }
                    });
                }
            },
            {
                label: 'Exit',
                icon: PhSignOut as any,
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

<route lang="json">
{
    "path": "/editor",
    "name": "Editor"
}
</route>
