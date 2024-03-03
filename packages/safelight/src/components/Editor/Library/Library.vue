<template>
    <SLCard>
        <Toolbar>
            <Button>A</Button>
        </Toolbar>
        <DataTable :value="media" scrollable scroll-height="400px" data-key="id">
            <Column field="name" header="Name">
                <template #loading="slotProps">
                    {{ slotProps }}
                </template>
            </Column>
            <Column header="Image">
                <template #body="slotProps">
                    <Image
                        :src="slotProps.data.previewImage"
                        :alt="'Preview image for' + slotProps.data.name"
                        class="w-[6rem] rounded shadow-md"
                    />
                </template>
            </Column>
            <Column field="id" header="ID" />
            <Column field="contentHash" header="Hash" />
        </DataTable>
    </SLCard>
</template>

<script setup lang="ts">
import type Media from '@/controllers/Media/Media';
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Image from 'primevue/image';
import type { UnwrapRef } from 'vue';

const media = defineModel<(Media | UnwrapRef<Media>)[]>({ default: [] });
</script>
