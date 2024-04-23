<template>
    <DataView
        :value="sortedAndFiltered"
        data-key="id"
        :pt="{
            header: {
                class: 'p-1'
            }
        }"
        :layout="layout"
    >
        <template #header>
            <Toolbar class="border-none p-0">
                <template #start>
                    <InputGroup class="mr-2">
                        <InputGroupAddon class="p-0">
                            <PhMagnifyingGlass />
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
                                <PhSortAscending v-if="!sortDescending" />
                                <PhSortDescending v-else />
                            </template>
                        </Button>
                        <Dropdown
                            v-model="sortBy"
                            style="line-height: 1.2"
                            aria-label="Sort by"
                            :options="['Name', 'Duration', 'File type']"
                        />
                    </InputGroup>
                    <DataViewLayoutOptions v-model="layout" />
                </template>
                <template #end>
                    <Button title="Load file" rounded @click="fileDialog.open()">
                        <template #icon>
                            <PhPlus />
                        </template>
                    </Button>
                </template>
            </Toolbar>
        </template>
        <template #grid="{ items }: { items: Media[] }">
            <div
                class="grid-nogutter grid select-none"
                role="grid"
                style="
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    grid-template-rows: min-content;
                "
                @dblclick.self="fileDialogOpenDblClick"
            >
                <div
                    v-for="item in items"
                    :key="item.id"
                    role="gridcell"
                    class="border-round m-1 flex min-h-32 select-text flex-col rounded-md border-solid border-white/10"
                    style="border-width: 1px"
                    :aria-label="item.name.value"
                >
                    <LibraryItem :item="item" />
                </div>
            </div>
        </template>
        <template #empty>
            <div
                class="grid h-full select-none place-items-center opacity-60"
                @dblclick="fileDialogOpenDblClick"
            >
                <label v-if="CurrentProject.project.value?.media.length == 0">
                    No media imported
                </label>
                <label v-else>No media found</label>
            </div>
        </template>
    </DataView>
</template>

<script setup lang="ts">
import { ProjectFeatures } from '@safelight/shared/base/Project';
import Media from '@safelight/shared/Media/Media';
import fuzzysearch from 'fuzzysearch';
import MimeMatcher from 'mime-matcher';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

useDropZone(document.body, {
    onDrop(files) {
        files?.forEach((file) => {
            if (CurrentProject.project.value?.hasFeature(ProjectFeatures.media)) {
                CurrentProject.project.value.loadFile(file);
            }
        });
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

        if (item && CurrentProject.project.value?.hasFeature(ProjectFeatures.media)) {
            CurrentProject.project.value.loadFile(item);
        }
    }
});

const search = ref('');
const sortBy = ref<sortOptions>('Name');
const sortDescending = ref(false);
const layout = ref<string>('grid');

const sortedAndFiltered = shallowRef<Media[]>([]);

watchDebounced(
    [CurrentProject.project.value?.media, search, sortBy, sortDescending],
    sortAndFilter,
    {
        deep: true,
        debounce: 100,
        maxWait: 1000,
        immediate: true
    }
);

function sortAndFilter() {
    if (!CurrentProject.project.value) return;

    const filtered = CurrentProject.project.value.media.filter((elem) => {
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
            case 'Media type':
                return collator.compare(item1.type.toString(), item1.type.toString());
            default:
                return collator.compare(item1.name.value, item2.name.value);
        }
    });

    sortedAndFiltered.value = filtered;
}

function fileDialogOpenDblClick(event: MouseEvent) {
    event.preventDefault();
    document.getSelection()?.removeAllRanges();
    fileDialog.open();
}

type sortOptions = 'Name' | 'Duration' | 'File type' | 'Media type';
</script>
