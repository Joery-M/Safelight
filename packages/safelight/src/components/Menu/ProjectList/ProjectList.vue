<template>
    <DataTable
        :value="projects"
        :loading
        edit-mode="cell"
        sort-field="updated"
        removable-sort
        :sort-order="-1"
        @row-dblclick="curProject.toEditor($event.data.id)"
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
                    @click="useProject().creators.newSimpleProject()"
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
                    @keydown.enter="
                        (event) => {
                            const value = (event.target as HTMLInputElement)?.value ?? '';
                            if (value !== data.name) {
                                setProjectName(value, data);
                            }
                        }
                    "
                    @blur="
                        (event) => {
                            const value = (event.target as HTMLInputElement)?.value ?? '';
                            if (value !== data.name) {
                                setProjectName(value, data);
                            }
                        }
                    "
                />
            </template>
            <template #body="{ data }">
                {{ data.name || $t('general.descriptions.untitled') }}
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
        <Column style="width: 0">
            <template #body="{ data }">
                <Button
                    v-tooltip="$t('general.actions.open')"
                    text
                    rounded
                    plain
                    @click="$router.push(`/editor/${data.id}`)"
                >
                    <template #icon>
                        <PhCaretRight />
                    </template>
                </Button>
            </template>
        </Column>
        <Column style="width: 0">
            <template #body="{ data }">
                <Button
                    v-tooltip="$t('general.actions.delete')"
                    text
                    rounded
                    plain
                    @click="$router.push(`/editor/${data.id}`)"
                >
                    <template #icon>
                        <PhTrash />
                    </template>
                </Button>
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import { PhArrowsClockwise, PhCaretRight, PhTrash } from '@phosphor-icons/vue';
import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import type { MenuItem } from 'primevue/menuitem';
import SplitButton from 'primevue/splitbutton';
import { computed, onMounted, ref, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const curProject = useProject();

const projectTypes = computed<MenuItem[]>(
    () =>
        [
            {
                label: t('project.types.simple'),
                command: () => curProject.creators.newSimpleProject()
            },
            { label: 'Test', command() {} }
        ] as const
);

const projects = shallowRef<StoredProject[]>([]);

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

    const storage = new (
        await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
    ).IndexedDbStorageController();

    await storage?.patchStoredProject({ id: project.id, name: newName });
    loadList();
}
</script>
