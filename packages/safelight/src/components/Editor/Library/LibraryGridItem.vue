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
    >
        <div
            class="bg-checkerboard relative flex aspect-video w-full items-center justify-center text-clip rounded-t-md"
        >
            <img
                v-if="false"
                class="overflow-none max-h-full max-w-full"
                :aria-label="item.name.value"
            />
            <Skeleton
                v-else
                class="max-h-full max-w-full rounded-none rounded-t-md"
                height="100%"
                width="100%"
            />
            <div v-if="size >= 96 && item.type" class="mediaType">
                <PhVideoCamera
                    v-if="item.isOfType(MediaSourceType.Video)"
                    v-tooltip="$t('media.attrs.video')"
                    weight="bold"
                    :aria-label="$t('media.attrs.video')"
                />
                <PhSpeakerHigh
                    v-if="item.isOfType(MediaSourceType.Audio)"
                    v-tooltip="$t('media.attrs.audio')"
                    weight="bold"
                    :aria-label="$t('media.attrs.audio')"
                />
                <PhSubtitles
                    v-if="item.isOfType(MediaSourceType.Subtitles)"
                    v-tooltip="$t('media.attrs.subtitles')"
                    weight="bold"
                    :aria-label="$t('media.attrs.subtitles')"
                />
                <PhImage
                    v-if="item.isOfType(MediaSourceType.Image)"
                    v-tooltip="$t('media.attrs.image')"
                    weight="bold"
                    :aria-label="$t('media.attrs.image')"
                />
                <PhFilmStrip
                    v-if="item.isOfType(MediaSourceType.Timeline)"
                    v-tooltip="$t('media.attrs.timeline')"
                    weight="bold"
                    :aria-label="$t('media.attrs.timeline')"
                />
                <PhSparkle
                    v-if="item.isOfType(MediaSourceType.Special)"
                    v-tooltip="$t('media.attrs.special')"
                    weight="bold"
                    :aria-label="$t('media.attrs.special')"
                />
            </div>
        </div>
        <div class="flex items-center gap-1 px-1">
            <p
                v-tooltip.bottom="{ value: item.name.value, showDelay: 500 }"
                class="line-clamp-2 flex-1 text-base"
            >
                {{ item.name.value }}
            </p>
            <Button
                v-if="size >= 96"
                :title="$t('media.properties')"
                text
                rounded
                severity="secondary"
                aria-haspopup="true"
                aria-controls="library_item_menu"
                @click="overlay?.toggle"
            >
                <template #icon>
                    <PhDotsThreeVertical size="20" />
                </template>
            </Button>
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
                    v-tooltip.bottom="{ value: 'Delete', showDelay: 500 }"
                    severity="secondary"
                    text
                    @click="alertt('yea no')"
                >
                    <template #icon>
                        <PhTrash />
                    </template>
                </Button>
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
import {
    PhDotsThreeVertical,
    PhFilmStrip,
    PhImage,
    PhSparkle,
    PhSpeakerHigh,
    PhSubtitles,
    PhTrash,
    PhVideoCamera
} from '@phosphor-icons/vue';
import { MediaSourceType, type MediaItem } from '@safelight/shared/Media/Media';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import Popover, { type PopoverMethods, type PopoverProps } from 'primevue/popover';
import Skeleton from 'primevue/skeleton';
import Toolbar from 'primevue/toolbar';
import { ref } from 'vue';

defineProps<{
    item: MediaItem;
    size: number;
}>();

const menuItems = ref<MenuItem[]>([
    {
        label: 'Temp'
    }
]);

const alertt = (text: string) => window.alert(text);

const overlay = ref<PopoverMethods & PopoverProps>();

function closeOtherOverlays() {
    if (document.activeElement && 'blur' in document.activeElement) {
        (document.activeElement as HTMLElement).blur();
    }
    // Weird, but fine
    document.body.click();
}
</script>

<style lang="scss" scoped>
.bg-checkerboard {
    /* This is beautifully simple
       https://stackoverflow.com/a/65129916 */
    background: repeating-conic-gradient(#ffffff0a 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}

.mediaType {
    @apply left-0 top-0 h-full w-full gap-2 p-2;

    position: absolute;
    display: flex;

    justify-content: end;
    align-items: end;

    background: radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.4) 0%, transparent 50%);
}
</style>
