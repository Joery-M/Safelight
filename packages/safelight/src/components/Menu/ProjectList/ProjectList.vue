<template>
    <DataTable :value="projects" :loading>
        <template #header>
            <div class="align-items-center justify-content-between flex flex-wrap gap-2">
                <h2 class="m-0 flex-1">Projects</h2>
                <Button rounded title="Refresh list" @click="loadList()">
                    <template #icon>
                        <PhArrowsClockwise />
                    </template>
                </Button>
                <SplitButton
                    label="New project"
                    rounded
                    :model="projectTypes"
                    @click="CurrentProject.newSimpleProject()"
                />
            </div>
        </template>
        <Column field="name" header="Project">
            <template #body="{ data }: { data: StoredProject }">
                <InplaceRename :value="data.name" @change="(ev) => setProjectName(ev, data)" />
            </template>
        </Column>
        <Column field="type" header="Type" />
        <Column header="Modified">
            <template #body="slotProps">
                {{ formatDateTime((slotProps.data as StoredProject).updated) }}
            </template>
        </Column>
        <Column>
            <template #body="slotProps">
                <Button @click="CurrentProject.openProject(slotProps.data)">Open</Button>
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import InplaceRename from '@/components/InplaceRename.vue';
import { CurrentProject } from '@/stores/currentProject';
import { PhArrowsClockwise } from '@phosphor-icons/vue';
import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import { DateTime } from 'luxon';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import type { MenuItem } from 'primevue/menuitem';
import SplitButton from 'primevue/splitbutton';
import { onMounted, ref } from 'vue';

const projectTypes: MenuItem[] = [
    {
        label: 'Simple',
        command: () => CurrentProject.newSimpleProject()
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
    return date.toLocaleString({
        dateStyle: 'long',
        timeStyle: 'short'
    });
}

async function setProjectName(newName: string, project: StoredProject) {
    const storage = await CurrentProject.getStorageControllerForProject(project);
    await storage?.UpdateStoredProject({ id: project.id, name: newName });
    loadList();
}
</script>
