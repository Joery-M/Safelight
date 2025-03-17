<template>
    <div
        role="gridcell"
        class="m-1 h-fit inline-flex flex-col select-text border-white/10 border-rounded rounded-md border-solid align-top"
        style="border-width: 1px"
        :style="{
            width: size + 'px'
        }"
        :aria-label="item.name.value"
        @contextmenu.prevent="
            (ev) => {
                closeOtherOverlays();
                overlay?.toggle(ev);
            }
        "
        @dblclick="clickHandler"
    >
        <div
            class="bg-checkerboard relative aspect-video w-full flex items-center justify-center text-clip rounded-t-md"
        >
            <img
                v-if="false"
                class="max-h-full max-w-full of-hidden"
                :aria-label="item.name.value"
            />
            <template v-else-if="item.isDirectory">
                <div class="i-ph-folder-bold size-max-80% size-18" />
            </template>
            <Skeleton
                v-else
                class="z-0 max-h-full max-w-full rounded-none rounded-t-md"
                height="100%"
                width="100%"
            />
            <div v-if="size >= 96 && item.media.value" class="media-type z-10">
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Video)"
                    v-tooltip.top="$t('media.attrs.video')"
                    class="i-ph-video-camera-bold"
                    :aria-label="$t('media.attrs.video')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Audio)"
                    v-tooltip.top="$t('media.attrs.audio')"
                    class="i-ph-speaker-high-bold"
                    :aria-label="$t('media.attrs.audio')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Subtitles)"
                    v-tooltip.top="$t('media.attrs.subtitles')"
                    class="i-ph-subtitles-bold"
                    :aria-label="$t('media.attrs.subtitles')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Image)"
                    v-tooltip.top="$t('media.attrs.image')"
                    class="i-ph-image-bold"
                    :aria-label="$t('media.attrs.image')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Timeline)"
                    v-tooltip.top="$t('media.attrs.timeline')"
                    class="i-ph-film-strip-bold"
                    :aria-label="$t('media.attrs.timeline')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Special)"
                    v-tooltip.top="$t('media.attrs.special')"
                    class="i-ph-sparkle-bold"
                    :aria-label="$t('media.attrs.special')"
                />
            </div>
        </div>
        <div class="min-h-14 flex items-center gap-1 px-1">
            <InplaceRename :value="item.name.value" @change="item.setName($event)">
                <template #default="{ open }">
                    <p
                        v-tooltip.bottom="{ value: item.name.value, showDelay: 500 }"
                        class="line-clamp-2 m-0 flex-1 cursor-pointer select-none text-base"
                        tabindex="0"
                        @dblclick.stop="
                            open();
                            nameEditorOpen = true;
                        "
                        @keypress.enter.stop="
                            open();
                            nameEditorOpen = true;
                        "
                    >
                        {{ item.name.value }}
                    </p>
                </template>
                <template #content="{ close, curValue, sendValue, setCurValue }">
                    <div v-focustrap>
                        <InputText
                            :pt="{
                                root: {
                                    style: 'width: 100%'
                                }
                            }"
                            autofocus
                            :model-value="curValue"
                            @update:model-value="setCurValue($event)"
                            @focusout="
                                close();
                                nameEditorOpen = false;
                            "
                            @keyup.enter.stop="
                                sendValue(true);
                                nameEditorOpen = false;
                            "
                            @keyup.escape.stop="
                                close();
                                nameEditorOpen = false;
                            "
                        />
                    </div>
                </template>
            </InplaceRename>
            <Button
                v-if="size >= 96 && !nameEditorOpen"
                :title="$t('media.properties')"
                text
                rounded
                severity="secondary"
                aria-haspopup="true"
                aria-controls="library_item_menu"
                icon="i-ph-dots-three-vertical"
                @click="overlay?.toggle"
            />
        </div>
    </div>
    <Popover
        id="library_item_menu"
        ref="overlay"
        :pt="{
            content: {
                style: 'padding: 0'
            }
        }"
    >
        <Toolbar
            :pt="{
                root: {
                    class: 'p-1 rounded-b-none',
                    style: 'border-width: 0 0 1px 0'
                }
            }"
        >
            <template #center>
                <Button
                    v-tooltip.top="{ value: 'Delete', showDelay: 500 }"
                    severity="secondary"
                    text
                    icon="i-ph-trash"
                    @click="item.deleteSelf()"
                />
            </template>
        </Toolbar>
        <Menu
            :model="menuItems"
            :pt="{
                root: {
                    style: 'border: none;'
                }
            }"
        />
    </Popover>
</template>
<script setup lang="ts">
import InplaceRename from '@/components/InplaceRename.vue';
import { useProject } from '@/stores/useProject';
import { MediaSourceType } from '@safelight/shared/Media/Media';
import type { FileTreeItem } from '@safelight/shared/Project/ProjectFileTree';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import Toolbar from 'primevue/toolbar';
import { ref, useTemplateRef } from 'vue';

const props = defineProps<{
    item: FileTreeItem;
    size: number;
}>();

const emit = defineEmits<{
    openDirectory: [item: FileTreeItem];
}>();

const project = useProject();

const nameEditorOpen = ref(false);

const menuItems = ref<MenuItem[]>([
    {
        label: 'Temp'
    }
]);

const overlay = useTemplateRef('overlay');

function closeOtherOverlays() {
    if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur();
    }
    // Weird, but fine
    document.body.click();
}

function clickHandler() {
    if (props.item.isDirectory) {
        emit('openDirectory', props.item);
    } else if (props.item.media.value) {
        const media = props.item.media.value;
        if (media.isTimeline()) {
            project.selectTimeline(media);
        }
    }
}
</script>

<style lang="scss" scoped>
.bg-checkerboard {
    /* This is beautifully simple
       https://stackoverflow.com/a/65129916 */
    background: repeating-conic-gradient(#ffffff0a 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}

.media-type {
    @apply left-0 top-0 h-full w-full gap-2 p-2;

    position: absolute;
    display: flex;

    justify-content: end;
    align-items: end;

    background: radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
}
</style>
