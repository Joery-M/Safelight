<template>
    <SLCard>
        <DataView
            :value="media"
            scrollable
            scroll-height="400px"
            data-key="id"
            class="m-4 resize-x"
        >
            <template #header>
                <Toolbar class="p-1">
                    <template #center>
                        <IconField iconPosition="left">
                            <InputIcon> <PhMagnifyingGlass /> </InputIcon>
                            <InputText size="small" placeholder="Search"> </InputText>
                        </IconField>
                    </template>
                </Toolbar>
            </template>
            <template #list="{ items }: { items: UnwrapRef<Media>[] }">
                <div
                    class="grid-nogutter grid"
                    style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))"
                >
                    <div
                        v-for="(item, index) in items"
                        :key="item.id"
                        class="border-round m-2 flex min-h-32 flex-col rounded-md border-solid border-white/10"
                        style="border-width: 1px"
                    >
                        <div class="flex aspect-video w-full items-center justify-center">
                            <img class="max-h-full max-w-full rounded-t" :src="item.previewImage" />
                        </div>
                        <p class="text-sm">
                            {{ item.name }}
                        </p>
                    </div>
                </div>
            </template>
        </DataView>
    </SLCard>
</template>

<script setup lang="ts">
import type Media from '@/controllers/Media/Media';
import { PhFileSearch } from '@phosphor-icons/vue';
import type { UnwrapRef } from 'vue';

const media = defineModel<(Media | UnwrapRef<Media>)[]>({ default: [] });
</script>
