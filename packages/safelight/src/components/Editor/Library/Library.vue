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
                            <PhMagnifyingGlass />
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
                            @click="sortDescending = !sortDescending"
                        >
                            <template #icon>
                                <PhSortAscending v-if="!sortDescending" />
                                <PhSortDescending v-else />
                            </template>
                        </Button>
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
        </template>
        <template #grid="{ items }: { items: FileTreeItem[] }">
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
                        @click="fileDialog.open()"
                    >
                        <template #icon>
                            <PhPlus />
                        </template>
                    </SplitButton>
                </template>
            </Toolbar>
        </template>
    </DataView>
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import { PhMagnifyingGlass, PhPlus, PhSortAscending, PhSortDescending } from '@phosphor-icons/vue';
import type { FileTreeItem } from '@safelight/shared/Project/ProjectFileTree';
import { useDropZone, useFileDialog } from '@vueuse/core';
import fuzzysearch from 'fuzzysearch';
import MimeMatcher from 'mime-matcher';
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
import { reactive, ref, shallowReactive, shallowRef, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import LibraryGridItem from './LibraryGridItem.vue';

const project = useProject();

useDropZone(document.body, {
    onDrop(files) {
        files?.forEach((file) => {
            project.p?.loadFile(file);
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
            project.p.loadFile(item);
        }
    }
});

const search = ref('');
const sortBy = ref<sortOptions>('name');
const sortDescending = ref(false);
const gridItemSize = ref(176); // 11rem
const directoryPath = shallowReactive<FileTreeItem[]>([]);

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
        command: () => {
            if (!project.p) return;
            project.p.createTimeline({
                framerate: 60,
                height: 1080,
                width: 1920,
                name: i18n.t('panels.timeline.title') + ' ' + project.p.media.size
            });
        }
    },
    {
        label: () => i18n.t('media.create.directory'),
        command: () => {
            const curDir = directoryPath[0] ?? project.p?.fileTree;
            if (!curDir) return;

            curDir.addDirectory(i18n.t('general.descriptions.directory'));
        }
    }
]);

const sortedAndFiltered = shallowRef<FileTreeItem[]>([]);

watchEffect(sortAndFilter);

function sortAndFilter() {
    if (!project.p) return;
    if (directoryPath.length == 0) {
        directoryPath.unshift(project.p.fileTree);
    }

    const curDir = directoryPath[0];
    const filtered = Array.from(curDir.children).filter((elem) => {
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
            case 'fileType':
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

type sortOptions = 'name' | 'duration' | 'fileType';
</script>
<style lang="scss" scoped>
#data-view {
    --p-dataview-footer-padding: 0.25rem;
}
</style>
