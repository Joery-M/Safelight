<template>
    <Card>
        <template #content>
            <DataTable :value="projects" :loading>
                <template #header>
                    <div class="align-items-center justify-content-between flex flex-wrap gap-2">
                        <h2 class="m-0 flex-1">Projects</h2>
                        <Button rounded title="Refresh list" @click="loadList()">
                            <template #icon>
                                <PhArrowsClockwise size="18" />
                            </template>
                        </Button>
                        <SplitButton
                            label="New project"
                            rounded
                            :model="projectTypes"
                            @click="newSimpleProject()"
                        />
                    </div>
                </template>
                <Column field="name" header="Project" />
                <Column field="type" header="Type" />
                <Column header="Modified">
                    <template #body="slotProps">
                        {{ formatDateTime((slotProps.data as StoredProject).updated) }}
                    </template>
                </Column>
                <Column>
                    <template #body="slotProps">
                        <Button @click="OpenProject(slotProps.data)">Open</Button>
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import { DateTime } from 'luxon';
import { router } from '@/main';
import type { MenuItem } from 'primevue/menuitem';

const projectTypes: MenuItem[] = [
    {
        label: 'Simple',
        command: newSimpleProject
    },
    { label: 'Test', command() {} }
] as const;

const projects = ref<StoredProject[]>([]);

const loading = ref(true);

onMounted(() => {
    loadList();
});
function loadList() {
    loading.value = true;
    Storage.getProjects()
        .then((p) => {
            projects.value = p;
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            loading.value = false;
        });
}

function formatDateTime(dt: string) {
    const date = DateTime.fromISO(dt).toLocal();
    return date.toLocaleString({ dateStyle: 'long', timeStyle: 'short' });
}

async function newSimpleProject() {
    const IndexedDbStorageController = (await import('@safelight/shared/Storage/IndexedDbStorage'))
        .default;
    Storage.setStorage(new IndexedDbStorageController());
    const projectStore = useProject();
    const SimpleProject = (await import('@safelight/shared/Project/SimpleProject')).default;
    projectStore.setProject(new SimpleProject());
    toEditor();
}

async function OpenProject(selectedProject: StoredProject) {
    if (selectedProject.type == 'Simple') {
        const IndexedDbStorageController = (
            await import('@safelight/shared/Storage/IndexedDbStorage')
        ).default;

        const projectStore = useProject();
        Storage.setStorage(new IndexedDbStorageController());

        const project = await Storage.getStorage().LoadProject(selectedProject.id);

        if (project) {
            projectStore.setProject(project);
            toEditor();
        } else {
            console.error('Could not load project');
        }
    } else {
        console.error('Project type not supported');
    }
}

function toEditor() {
    router.push('/editor');
}
</script>
