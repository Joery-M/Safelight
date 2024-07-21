<template>
    <DataTable
        :value="projects"
        :loading
        edit-mode="cell"
        sort-field="updated"
        removable-sort
        :sort-order="-1"
    >
        <template #header>
            <div class="align-items-center justify-content-between flex flex-wrap gap-2">
                <h2 class="m-0 flex-1">{{ $t('general.descriptions.project', 2) }}</h2>
                <Button rounded :title="$t('general.descriptions.refresh')" @click="loadList()">
                    <template #icon>
                        <PhArrowsClockwise />
                    </template>
                </Button>
                <SplitButton
                    :label="$t('project.new')"
                    rounded
                    :model="projectTypes"
                    @click="CurrentProject.newSimpleProject()"
                />
            </div>
        </template>
        <Column
            field="name"
            sortable
            :header="$t('general.descriptions.project')"
            :pt="{ bodyCell: { style: 'width: min-content;' } }"
        >
            <template #editor="{ data }">
                <InputText
                    :model-value="data.name"
                    autofocus
                    fluid
                    @keydown.enter="setProjectName($event.target.value, data)"
                    @blur="setProjectName($event.target.value, data)"
                />
            </template>
        </Column>
        <Column field="type" :header="$t('general.descriptions.type')" sortable>
            <template #body="slotProps">
                {{ $t('project.types.' + slotProps.data.type.toLowerCase(), slotProps.data.type) }}
            </template>
        </Column>
        <Column
            field="updated"
            :header="$t('general.descriptions.modified')"
            sortable
            data-type="date"
        >
            <template #body="slotProps">
                {{ $d(new Date((slotProps.data as StoredProject).updated), 'dateTime') }}
            </template>
        </Column>
        <Column
            field="created"
            :header="$t('general.descriptions.created')"
            sortable
            data-type="date"
        >
            <template #body="slotProps">
                {{ $d(new Date((slotProps.data as StoredProject).created), 'dateTime') }}
            </template>
        </Column>
        <Column>
            <template #body="slotProps">
                <Button @click="CurrentProject.openProject(slotProps.data)">
                    {{ $t('general.actions.open') }}
                </Button>
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { CurrentProject } from '@/stores/currentProject';
import { PhArrowsClockwise } from '@phosphor-icons/vue';
import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import type { MenuItem } from 'primevue/menuitem';
import SplitButton from 'primevue/splitbutton';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const projectTypes = computed<MenuItem[]>(
    () =>
        [
            {
                label: t('project.types.simple'),
                command: () => CurrentProject.newSimpleProject()
            },
            { label: 'Test', command() {} }
        ] as const
);

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

async function setProjectName(newName: string, project: StoredProject) {
    if (!newName || newName.length == 0) {
        return;
    }
    const storage = await CurrentProject.getStorageControllerForProject(project);
    await storage?.UpdateStoredProject({ id: project.id, name: newName });
    loadList();
}
</script>
