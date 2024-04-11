<template>
    <Card>
        <template #content>
            <DataTable :value="projects">
                <Column field="name" header="Project" />
                <Column field="type" header="Type" />
                <Column header="Modified">
                    <template #body="slotProps">
                        {{ formatDateTime((slotProps.data as StoredProject).updated) }}
                    </template>
                </Column>
            </DataTable>
        </template>
    </Card>
</template>

<script setup lang="ts">
import type { StoredProject } from '@safelight/shared/base/Storage';
import { DateTime } from 'luxon';

const projects = ref<StoredProject[]>([]);

function formatDateTime(dt: string) {
    const date = DateTime.fromISO(dt).toLocal();
    const thisYear = DateTime.now().year;
    if (date.year !== thisYear) {
        return date.toFormat('dd LLL yyyy HH:mm');
    }
    return date.toFormat('dd LLL HH:mm');
}
</script>
