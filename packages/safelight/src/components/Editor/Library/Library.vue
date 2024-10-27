<template>
    <DataView
        id="data-view"
        :value="sortedAndFiltered"
        class="flex h-full flex-col"
        data-key="id"
        :pt="{
            header: {
                class: 'p-1'
            },
            content: {
                style: 'flex-grow: 1; min-height: 0;'
            },
            emptyMessage: {
                style: 'height: 100%;'
            },
            footer: {
                style: 'flex-shrink: 1; display: flex; align-items: end'
            }
        }"
        layout="grid"
    >
        <template #header>
            <Toolbar class="border-none p-0">
                <template #start>
                    <InputGroup class="mr-2">
                        <InputGroupAddon class="p-0">
                            <i class="ph ph-magnifying-glass"></i>
                        </InputGroupAddon>
                        <InputText v-model="search" :placeholder="$t('general.actions.search')">
                        </InputText>
                    </InputGroup>
                    <InputGroup>
                        <Button
                            size="small"
                            class="p-0"
                            outlined
                            severity="secondary"
                            :title="
                                sortDescending
                                    ? $t('general.actions.sortAscending')
                                    : $t('general.actions.sortDescending')
                            "
                            :aria-label="
                                sortDescending
                                    ? $t('general.actions.sortAscending')
                                    : $t('general.actions.sortDescending')
                            "
                            :icon="
                                sortDescending ? 'ph ph-sort-descending' : 'ph ph-sort-ascending'
                            "
                            @click="sortDescending = !sortDescending"
                        />
                        <Select
                            v-model="sortBy"
                            style="line-height: 1.2"
                            :aria-label="$t('general.actions.sortBy')"
                            option-label="label"
                            option-value="value"
                            :options="[
                                { label: $t('general.descriptions.name'), value: 'name' },
                                { label: $t('general.descriptions.duration'), value: 'duration' },
                                { label: $t('general.descriptions.fileType'), value: 'fileType' }
                            ]"
                        />
                    </InputGroup>
                </template>
            </Toolbar>
            <Breadcrumb
                id="directory-path"
                ref="breadCrumbPath"
                :model="breadcrumbItems"
                :home="{
                    key: 'home',
                    icon: 'ph-bold ph-house',
                    command: () => {
                        while (directoryPath.shift());
                    }
                }"
                :pt="{
                    itemLink: {
                        // To stop ctrl click and shift click from opening tabs
                        href: undefined,
                        style: 'cursor: pointer'
                    }
                }"
            />
        </template>
        <template #grid="{ items }: { items: FileTreeItem[] }">
            <div
                class="h-full select-none overflow-y-auto"
                role="grid"
                @dblclick.self="fileDialogOpenDblClick"
            >
                <template v-for="item in items" :key="item.id">
                    <LibraryGridItem
                        :item="item"
                        :size="gridItemSize"
                        @open-directory="
                            (item) => {
                                directoryPath.unshift(item);
                                nextTick(() => {
                                    // Scroll to last item in breadcrumb
                                    breadCrumbPath?.$el
                                        .querySelector('li:last-of-type')
                                        .scrollIntoView();
                                });
                            }
                        "
                    />
                </template>
            </div>
        </template>
        <template #empty>
            <div
                class="grid h-full select-none place-items-center opacity-60"
                @dblclick="fileDialogOpenDblClick"
            >
                <label v-if="project.p?.media.size == 0">
                    {{ $t('panels.library.noMediaLoaded') }}
                </label>
                <label v-else>
                    {{ $t('panels.library.noMediaFound') }}
                </label>
            </div>
        </template>
        <template #footer>
            <Toolbar class="grow border-none p-0">
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
                <template #end>
                    <SplitButton
                        outlined
                        severity="secondary"
                        :model="createMenuItems"
                        icon="ph ph-plus"
                        @click="fileDialog.open()"
                    />
                </template>
            </Toolbar>
        </template>
    </DataView>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import { MediaSourceType } from '@safelight/shared/Media/Media';
import type { FileTreeItem } from '@safelight/shared/Project/ProjectFileTree';
import { useDropZone, useFileDialog } from '@vueuse/core';
import fuzzysearch from 'fuzzysearch';
import MimeMatcher from 'mime-matcher';
import Breadcrumb from 'primevue/breadcrumb';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import type { MenuItem } from 'primevue/menuitem';
import Select from 'primevue/select';
import Slider from 'primevue/slider';
import SplitButton from 'primevue/splitbutton';
import Toolbar from 'primevue/toolbar';
import {
    computed,
    nextTick,
    reactive,
    ref,
    shallowReactive,
    shallowRef,
    watchEffect,
    type ComponentInstance
} from 'vue';
import { useI18n } from 'vue-i18n';
import LibraryGridItem from './LibraryGridItem.vue';

const project = useProject();

useDropZone(document.body, {
    onDrop(files) {
        files?.forEach(async (file) => {
            const media = await project.p?.loadFile(file, false);
            if (media) {
                curDir.value?.addFile(media);
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

        if (item && project.p) {
            project.p?.loadFile(item, false).then((media) => {
                if (media) {
                    curDir.value?.addFile(media);
                }
            });
        }
    }
});

const search = ref('');
const sortBy = ref<sortOptions>('name');
const sortDescending = ref(false);
const gridItemSize = ref(176); // 11rem

const breadCrumbPath = ref<ComponentInstance<typeof Breadcrumb>>();
const directoryPath = shallowReactive<FileTreeItem[]>([]);
const curDir = computed(() => directoryPath[0] ?? project.p?.fileTree);
const breadcrumbItems = computed(() => {
    return directoryPath.toReversed().map<MenuItem>((item, i) => ({
        label: item.name.value,
        key: item.id,
        command: () => {
            const newPath = directoryPath.slice(directoryPath.length - (i + 1));
            // Clear path array
            while (directoryPath.shift());
            directoryPath.push(...newPath);
        }
    }));
});

const i18n = useI18n();

const createMenuItems = reactive<MenuItem[]>([
    {
        label: () => i18n.t('media.create.file'),
        command: () => {
            fileDialog.open();
        }
    },
    {
        label: () => i18n.t('media.create.timeline'),
        command: async () => {
            if (!project.p) return;
            const timeline = await project.p.createTimeline(
                {
                    framerate: 60,
                    height: 1080,
                    width: 1920,
                    name: i18n.t('panels.timeline.title') + ' ' + project.p.media.size
                },
                false
            );
            if (timeline) {
                project.selectedTimeline = timeline.id;
                curDir.value?.addFile(timeline);
            }
        }
    },
    {
        label: () => i18n.t('media.create.directory'),
        command: () => {
            curDir.value?.addDirectory(i18n.t('general.descriptions.directory'));
        }
    }
]);

const sortedAndFiltered = shallowRef<FileTreeItem[]>([]);

watchEffect(sortAndFilter);

function sortAndFilter() {
    if (!project.p) return;

    const filtered = Array.from(curDir.value?.children).filter((elem) => {
        if (search.value.length == 0) {
            return true;
        }

        return fuzzysearch(search.value.toLowerCase(), elem.name.value.toLowerCase());
    });

    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

    filtered.sort((a, b) => {
        const item1 = sortDescending.value ? b : a;
        const item2 = sortDescending.value ? a : b;

        switch (sortBy.value) {
            case 'fileType': {
                const ext1 =
                    item1.media.value?.getMetadata('media.sourceType') ?? MediaSourceType.Unknown;
                const ext2 =
                    item2.media.value?.getMetadata('media.sourceType') ?? MediaSourceType.Unknown;

                return ext1 - ext2;
            }
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

type sortOptions = 'name' | 'duration' | 'fileType';
</script>

<style lang="scss" scoped>
#data-view {
    --p-dataview-footer-padding: 0.25rem;
}

#directory-path {
    --p-breadcrumb-padding: 0.25rem;
    scrollbar-width: none;
    scroll-behavior: smooth;
}

.p-breadcrumb ::v-deep(.ph-bold.ph-house) {
    @apply flex items-center;

    height: 22.4px;
    transition: color var(--p-transition-duration);

    &:hover {
        color: var(--p-text-color);
    }
}
</style>
