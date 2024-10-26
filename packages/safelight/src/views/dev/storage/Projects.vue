<template>
    <Card>
        <template #subtitle>
            <RouterLink to="/dev/storage">
                <Button icon="ph ph-arrow-left" />
            </RouterLink>
        </template>
        <template #content>
            <DataTable :loading="projectGetting.isLoading.value" :value="projects">
                <Column :header="$t('general.descriptions.name')" field="name"></Column>
                <Column :header="$t('general.descriptions.created')" field="created">
                    <template #body="{ data }">
                        {{ $d(data.updated, 'dateTime') }}
                    </template>
                </Column>
                <Column :header="$t('general.descriptions.modified')" field="updated">
                    <template #body="{ data }">
                        {{ $d(data.updated, 'dateTime') }}
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<script lang="ts" setup>
import { Storage, type StoredProject } from '@safelight/shared/base/Storage';
import { useAsyncState } from '@vueuse/core';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import { shallowRef } from 'vue';
import { RouterLink } from 'vue-router';

const projects = shallowRef<StoredProject[]>([]);

const projectGetting = useAsyncState(Storage.getProjects(), [], {
    onSuccess: (project) => {
        projects.value = project;
    }
});
</script>
