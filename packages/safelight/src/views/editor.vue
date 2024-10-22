<template>
    <template v-if="projectLoaded">
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
                    v-if="project.p !== undefined"
                    :value="project.p.name.value"
                    @change="
                        (newName: string) => {
                            project.p!.name.value = newName;
                            project.p?.save();
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
import { router } from '@/router';
import { useEditor } from '@/stores/useEditor';
import { useProject } from '@/stores/useProject';
import { PhFile, PhGear, PhSignOut } from '@phosphor-icons/vue';
import { useTitle } from '@vueuse/core';
import ConfirmDialog from 'primevue/confirmdialog';
import Menubar from 'primevue/menubar';
import type { MenuItem } from 'primevue/menuitem';
import Toolbar from 'primevue/toolbar';
import { useConfirm } from 'primevue/useconfirm';
import { useDialog } from 'primevue/usedialog';
import { defineAsyncComponent, onMounted, ref, watchEffect } from 'vue';
import { onBeforeRouteLeave, useRoute } from 'vue-router';

const project = useProject();
const editor = useEditor();

editor.AddDefaultPanels();

const projectLoaded = ref(false);

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
                        () => import('@/components/Menu/Settings/Settings.vue')
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
                    project.$reset();
                    router.push('/projects');
                }
            }
        ]
    }
];

const route = useRoute('Editor');

onMounted(async () => {
    await router.isReady();

    if (route.params?.projectId) {
        // Check if the project ID from the URL is the one that is loaded
        console.log(project.isLoaded, project.p?.id, project.p?.id === route.params.projectId);
        if (project.isLoaded && project.p?.id && project.p.id === route.params.projectId) {
            projectLoaded.value = true;
            return;
        }
        const success = await project.openProject({ id: route.params.projectId });
        projectLoaded.value = true;
        if (!success) {
            showNoProjectDialog();
        }
    } else {
        showNoProjectDialog();
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

definePage({
    meta: {
        overridePageName: true
    }
});

watchEffect(() => {
    useTitle(project.p?.name.value ? project.p?.name.value + ' | Safelight' : 'Safelight');
});

onBeforeRouteLeave(() => {
    project.$reset();
});
</script>
