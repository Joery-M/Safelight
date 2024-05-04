<template>
    <div
        role="gridcell"
        class="border-round m-1 flex min-h-32 select-text flex-col rounded-md border-solid border-white/10"
        style="border-width: 1px; aspect-ratio: 10/9"
        :aria-label="item.name.value"
    >
        <div
            class="bg-checkerboard relative flex aspect-video w-full items-center justify-center overflow-clip rounded-t-md"
        >
            <img
                v-if="item.previewImage.value"
                class="overflow-none max-h-full max-w-full"
                :aria-label="'Preview image for ' + item.name.value"
                :src="item.previewImage.value"
            />
            <Skeleton
                v-else
                class="max-h-full max-w-full rounded-none rounded-t-md"
                height="100%"
                width="100%"
            />
            <div class="mediaType">
                <PhVideoCamera
                    v-if="item.isOfType(MediaType.Video)"
                    weight="bold"
                    aria-label="Media has video"
                />
                <PhSpeakerHigh
                    v-if="item.isOfType(MediaType.Audio)"
                    weight="bold"
                    aria-label="Media has audio"
                />
                <PhSubtitles
                    v-if="item.isOfType(MediaType.Text)"
                    weight="bold"
                    aria-label="Media has subtitles"
                />
                <PhImage
                    v-if="item.isOfType(MediaType.Image)"
                    weight="bold"
                    aria-label="Media is an image"
                />
            </div>
        </div>
        <div class="flex items-center gap-1 px-1">
            <p
                v-tooltip.bottom="{ value: item.name.value, showDelay: 500 }"
                class="flex-1 overflow-x-hidden overflow-ellipsis whitespace-nowrap text-base"
            >
                {{ item.name.value }}
            </p>
            <Button
                title="Options"
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
    <OverlayPanel
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
                    severity="contrast"
                    text
                    :disabled="hasItemInTimeline"
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
    </OverlayPanel>
</template>
<script setup lang="ts">
import { ProjectFeatures } from '@safelight/shared/base/Project';
import type Media from '@safelight/shared/Media/Media';
import { MediaType } from '@safelight/shared/Media/Media';
import type Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import type OverlayPanel from 'primevue/overlaypanel';

const props = defineProps<{
    item: Media;
}>();

const menuItems = ref<MenuItem[]>([
    {
        label: 'Temp'
    }
]);

const hasItemInTimeline = computed(
    () =>
        CurrentProject.project.value &&
        CurrentProject.project.value.hasFeature(ProjectFeatures.media) &&
        CurrentProject.project.value.usesMedia(props.item)
);

const alertt = (text: string) => window.alert(text);

const overlay = ref<OverlayPanel>();
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

    background: radial-gradient(circle at 100% 100%, rgba(0, 0, 0, 0.4) 0%, transparent 100%);
}
</style>
