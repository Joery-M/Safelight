<template>
    <DataTable
        class="datatable"
        :value="loadList.state.value"
        :loading="loadList.isLoading.value"
        edit-mode="cell"
        sort-field="updated"
        removable-sort
        :sort-order="-1"
        @row-dblclick="$router.push(`/editor/${$event.data.id}`)"
    >
        <template #header>
            <div class="align-items-center justify-content-between flex flex-wrap gap-2">
                <h2 class="m-0 flex-1">{{ $t('general.descriptions.project', 2) }}</h2>
                <Button
                    rounded
                    :title="$t('general.descriptions.refresh')"
                    icon="ph ph-arrows-clockwise"
                    @click="loadList.execute()"
                />
                <SplitButton
                    :label="$t('project.new')"
                    rounded
                    :model="projectTypes"
                    @click="
                        async () => {
                            const project = await curProject.creators.newSimpleProject();
                            $router.push({ name: 'Editor', params: { projectId: project.id } });
                        }
                    "
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
                    v-tooltip="$t('general.actions.delete')"
                    class="delete-btn"
                    text
                    rounded
                    plain
                    icon="ph ph-trash"
                    @click="curProject.deleteProject(data.id).then(() => loadList.execute())"
                />
            </template>
        </Column>
        <Column style="width: 0">
            <template #body="{ data }">
                <Button
                    v-tooltip="$t('general.actions.open')"
                    text
                    rounded
                    plain
                    icon="ph ph-caret-right"
                    @click="$router.push(`/editor/${data.id}`)"
                />
            </template>
        </Column>
    </DataTable>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import { useAsyncState } from '@vueuse/core';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import type { MenuItem } from 'primevue/menuitem';
import SplitButton from 'primevue/splitbutton';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const curProject = useProject();
const router = useRouter();

const projectTypes = computed<MenuItem[]>(
    () =>
        [
            {
                label: t('project.types.simple'),
                command: async () => {
                    const project = await curProject.creators.newSimpleProject();
                    router.push({ name: 'Editor', params: { projectId: project.id } });
                }
            },
            { label: 'Test', command() {} }
        ] as const
);

const loadList = useAsyncState(Storage.getProjects, [], { immediate: true });

async function setProjectName(newName: string, project: StoredProject) {
    if (!newName || newName.length == 0) {
        return;
    }

    const storage = new (
        await import('@safelight/shared/Storage/LocalStorage/IndexedDbStorage')
    ).IndexedDbStorageController();

    await storage?.patchStoredProject({ id: project.id, name: newName });
    loadList.execute();
}
</script>

<style lang="scss" scoped>
.datatable :deep(tr) {
    .delete-btn {
        @apply transition-opacity;

        opacity: 0;
    }

    &:hover .delete-btn,
    .delete-btn:focus-visible {
        opacity: 1;
    }
}
</style>
