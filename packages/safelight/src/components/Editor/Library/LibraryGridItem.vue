<template>
    <div
        role="gridcell"
        class="border-round m-1 flex h-fit select-text flex-col rounded-md border-solid border-white/10"
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
            class="bg-checkerboard relative flex aspect-video w-full items-center justify-center text-clip rounded-t-md"
        >
            <img
                v-if="false"
                class="overflow-none max-h-full max-w-full"
                :aria-label="item.name.value"
            />
            <template v-else-if="item.isDirectory">
                <PhFolder weight="bold" style="max-width: 80%; max-height: 80%" :size="70" />
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
                    class="ph-bold ph-video-camera"
                    :aria-label="$t('media.attrs.video')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Audio)"
                    v-tooltip.top="$t('media.attrs.audio')"
                    class="ph-bold ph-speaker-high"
                    :aria-label="$t('media.attrs.audio')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Subtitles)"
                    v-tooltip.top="$t('media.attrs.subtitles')"
                    class="ph-bold ph-subtitles"
                    :aria-label="$t('media.attrs.subtitles')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Image)"
                    v-tooltip.top="$t('media.attrs.image')"
                    class="ph-bold ph-image"
                    :aria-label="$t('media.attrs.image')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Timeline)"
                    v-tooltip.top="$t('media.attrs.timeline')"
                    class="ph-bold ph-film-strip"
                    :aria-label="$t('media.attrs.timeline')"
                />
                <i
                    v-if="item.media.value.isOfType(MediaSourceType.Special)"
                    v-tooltip.top="$t('media.attrs.special')"
                    class="ph-bold ph-sparkle"
                    :aria-label="$t('media.attrs.special')"
                />
            </div>
        </div>
        <div class="flex min-h-14 items-center gap-1 px-1">
            <InplaceRename :value="item.name.value" @change="item.setName($event)">
                <template #default="{ open }">
                    <p
                        v-tooltip.bottom="{ value: item.name.value, showDelay: 500 }"
                        class="m-0 line-clamp-2 flex-1 cursor-pointer select-none text-base"
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
                icon="ph ph-dots-three-vertical"
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
                    icon="ph ph-trash"
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
import { PhFolder } from '@phosphor-icons/vue';
import { MediaSourceType } from '@safelight/shared/Media/Media';
import type { FileTreeItem } from '@safelight/shared/Project/ProjectFileTree';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import Toolbar from 'primevue/toolbar';
import { ref, type ComponentInstance } from 'vue';

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

const overlay = ref<ComponentInstance<typeof Popover>>();

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
            project.p?.selectTimeline(media);
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
