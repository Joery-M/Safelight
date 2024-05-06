<template>
    <DataView
        v-if="layout == 'grid'"
        :value="sortedAndFiltered"
        class="flex h-full flex-col"
        data-key="id"
        :pt="{
            header: {
                class: 'p-1'
            },
            content: {
                style: 'flex-shrink: 1; min-height: 0;'
            },
            emptyMessage: {
                style: 'height: 100%;'
            },
            footer: {
                style: 'flex-grow: 1; display: flex; align-items: end'
            }
        }"
        layout="grid"
    >
        <template #header>
            <Toolbar class="border-none p-0">
                <template #start>
                    <DataViewLayoutOptions v-model="layout" class="mr-2 min-w-fit" />
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
                class="flex h-full select-none flex-wrap justify-center overflow-y-auto"
                role="grid"
                @dblclick.self="fileDialogOpenDblClick"
            >
                <template v-for="item in items" :key="item.id">
                    <LibraryGridItem :item="item" :size="gridItemSize" />
                </template>
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
        <template #footer>
            <Toolbar class="border-none p-0">
                <template #start>
                    <Slider
                        v-model="gridItemSize"
                        orientation="horizontal"
                        :min="50"
                        :max="300"
                        :step="10"
                        class="w-48 max-w-full"
                    />
                </template>
            </Toolbar>
        </template>
    </DataView>
    <DataTable
        v-else-if="layout == 'list'"
        class="flex h-full flex-col"
        :value="sortedAndFiltered"
        :pt="{
            header: {
                class: 'p-1'
            },
            wrapper: {
                style: 'flex-shrink: 1'
            },
            table: {
                class: 'h-full'
            }
        }"
        sort-field="field"
        sort-mode="single"
        scrollable
        resizable-columns
        column-resize-mode="expand"
        data-key="id"
    >
        <Column header="Type" body-class="px-0">
            <template #body="{ data }: { data: Media }">
                <div class="flex gap-2 pl-2">
                    <PhVideoCamera
                        v-if="data.isOfType(MediaType.Video)"
                        weight="bold"
                        aria-label="Media has video"
                    />
                    <PhSpeakerHigh
                        v-if="data.isOfType(MediaType.Audio)"
                        weight="bold"
                        aria-label="Media has audio"
                    />
                    <PhSubtitles
                        v-if="data.isOfType(MediaType.Text)"
                        weight="bold"
                        aria-label="Media has subtitles"
                    />
                    <PhImage
                        v-if="data.isOfType(MediaType.Image)"
                        weight="bold"
                        aria-label="Media is an image"
                    />
                </div>
            </template>
        </Column>
        <Column field="name.value" header="Name" sortable />
        <Column field="duration.value" header="Duration" sortable>
            <template #body="{ data }: { data: Media }">
                <template v-if="data.isOfType(MediaType.Image)">
                    {{ Timecode.toFormattedTimecode(5000) }}
                </template>
                <template v-else>
                    {{ Timecode.toFormattedTimecode(data.duration.value * 1000) }}
                </template>
            </template>
        </Column>
        <template #header>
            <Toolbar class="border-none p-0">
                <template #start>
                    <DataViewLayoutOptions v-model="layout" class="mr-2 min-w-fit" />
                    <InputGroup class="mr-2">
                        <InputGroupAddon class="p-0">
                            <PhMagnifyingGlass />
                        </InputGroupAddon>
                        <InputText v-model="search" placeholder="Search"> </InputText>
                    </InputGroup>
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
    </DataTable>
</template>

<script setup lang="ts">
import { ProjectFeatures } from '@safelight/shared/base/Project';
import Media, { MediaType } from '@safelight/shared/Media/Media';
import Timecode from '@safelight/shared/Timecode';
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
const gridItemSize = ref(176); // 11rem

const sortedAndFiltered = shallowRef<Media[]>([]);

// Reset sorting when changing to list
// List has its own sorting
watchEffect(() => {
    if (layout.value == 'list') {
        sortBy.value = 'Name';
        sortDescending.value = false;
    }
});

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

type sortOptions = 'Name' | 'Duration' | 'File type';
</script>
