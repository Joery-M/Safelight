<template>
    <DataView
        :value="sortedAndFiltered"
        scrollable
        scroll-height="400px"
        class="flex h-full flex-col"
        data-key="id"
        @dblclick="fileDialog.open()"
    >
        <template #header>
            <Toolbar class="border-none p-0">
                <template #start>
                    <InputGroup class="mr-2">
                        <InputGroupAddon class="p-0">
                            <PhMagnifyingGlass size="14" />
                        </InputGroupAddon>
                        <InputText v-model="search" placeholder="Search"> </InputText>
                    </InputGroup>
                    <InputGroup>
                        <Button
                            size="small"
                            class="p-0"
                            outlined
                            severity="secondary"
                            :aria-label="'Sort ' + (sortDescending ? 'ascending' : 'descending')"
                            @click="sortDescending = !sortDescending"
                        >
                            <template #icon>
                                <PhSortAscending v-if="!sortDescending" size="14" />
                                <PhSortDescending v-else size="14" />
                            </template>
                        </Button>
                        <Dropdown
                            v-model="sortBy"
                            style="line-height: 1.2"
                            aria-label="Sort by"
                            :options="['Name', 'Duration', 'File type']"
                        />
                    </InputGroup>
                </template>
            </Toolbar>
        </template>
        <template #list="{ items }: { items: UnwrapRef<Media>[] }">
            <div
                class="grid-nogutter grid"
                role="grid"
                style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))"
            >
                <div
                    v-for="item in items"
                    :key="item.id"
                    role="gridcell"
                    class="border-round m-1 flex min-h-32 flex-col rounded-md border-solid border-white/10"
                    style="border-width: 1px"
                    :aria-label="item.name"
                >
                    <div
                        class="bg-checkerboard flex aspect-video w-full items-center justify-center"
                    >
                        <img
                            v-if="item.previewImage"
                            class="max-h-full max-w-full rounded-t-md"
                            :aria-label="'Preview image for ' + item.name"
                            :src="item.previewImage"
                        />
                        <Skeleton
                            v-else
                            class="max-h-full max-w-full rounded-none rounded-t-md"
                            height="100%"
                            width="100%"
                        />
                    </div>
                    <p
                        v-tooltip.bottom="{ value: item.name.value, showDelay: 1000 }"
                        class="m-0 mt-1 max-w-full overflow-x-hidden overflow-ellipsis text-base"
                    >
                        {{ item.name.value }}
                    </p>
                    <p v-if="item.duration > 0">
                        {{ item.duration }}
                    </p>
                </div>
            </div>
        </template>
        <template #empty>
            <div class="grid h-full place-items-center" @dblclick="fileDialog.open()">
                <label class="select-none opacity-60">No media imported</label>
            </div>
        </template>
    </DataView>
</template>

<script setup lang="ts">
import { PhMagnifyingGlass, PhSortDescending } from '@phosphor-icons/vue';
import Media from '@safelight/shared/Media/Media';
import fuzzysearch from 'fuzzysearch';
import MimeMatcher from 'mime-matcher';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import type { UnwrapRef } from 'vue';

useDropZone(document.body, {
    onDrop(files) {
        files?.forEach(project.loadFile);
    },
    dataTypes(types) {
        return !types.some((val) => {
            return !new MimeMatcher('image/*', 'video/*').match(val);
        });
    }
});
const fileDialog = useFileDialog({
    accept: 'image/*,video/*'
});

fileDialog.onChange((fileList) => {
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
        const item = fileList.item(i);

        if (item) {
            project.loadFile(item);
        }
    }
});

const project = useProject();
const media = project.project!.media;

const search = ref('');
const sortBy = ref<sortOptions>('Name');
const sortDescending = ref(false);

const sortedAndFiltered = shallowRef<Media[]>([]);

watchDebounced([media, search, sortBy, sortDescending], sortAndFilter, {
    deep: true,
    debounce: 100,
    maxWait: 1000,
    immediate: true
});

function sortAndFilter() {
    const filtered = media.filter((elem) => {
        if (search.value.length == 0) {
            return true;
        }

        return fuzzysearch(search.value.toLowerCase(), elem.name.value.toLowerCase());
    });

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

    filtered.sort((a, b) => {
        const item1 = sortDescending.value ? b : a;
        const item2 = sortDescending.value ? a : b;

        const ext1 = item1.name.value.split('.').at(-1) ?? 'ZZZ';
        const ext2 = item2.name.value.split('.').at(-1) ?? 'ZZZ';

        switch (sortBy.value) {
            case 'Duration':
                return item1.duration.value - item2.duration.value;
            case 'File type':
                return collator.compare(ext1, ext2);
            default:
                return collator.compare(item1.name.value, item2.name.value);
        }
    });

    sortedAndFiltered.value = filtered;
}

type sortOptions = 'Name' | 'Duration' | 'File type';
</script>

<style lang="scss" scoped>
.bg-checkerboard {
    /* This is beautifully simple
       https://stackoverflow.com/a/65129916 */
    background: repeating-conic-gradient(#ffffff0a 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}

:deep(.p-dataview-header) {
    @apply p-1;
}
:deep(.p-dataview-content) {
    @apply flex-1;
}
:deep(.p-dataview-emptymessage) {
    @apply h-full;
}
</style>
