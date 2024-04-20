<template>
    <div
        class="bg-checkerboard flex aspect-video w-full items-center justify-center overflow-clip rounded-t-md"
    >
        <img
            v-if="$props.item.previewImage.value"
            class="overflow-none max-h-full max-w-full"
            :aria-label="'Preview image for ' + $props.item.name.value"
            :src="$props.item.previewImage.value"
        />
        <Skeleton
            v-else
            class="max-h-full max-w-full rounded-none rounded-t-md"
            height="100%"
            width="100%"
        />
    </div>
    <div class="flex items-center gap-1 px-1">
        <p
            v-tooltip.bottom="{ value: $props.item.name.value, showDelay: 500 }"
            class="flex-1 overflow-x-hidden overflow-ellipsis whitespace-nowrap text-base"
        >
            {{ $props.item.name.value }}
        </p>
        <Button
            title="Options"
            text
            rounded
            severity="secondary"
            aria-haspopup="true"
            aria-controls="library_item_menu"
            @click="overlay?.show"
        >
            <template #icon>
                <PhDotsThreeVertical size="20" />
            </template>
        </Button>
    </div>
    <OverlayPanel id="library_item_menu" ref="overlay">
        <Toolbar>
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
        <Menu :model="menuItems" />
    </OverlayPanel>
</template>
<script setup lang="ts">
import { PhTrash, type PhDotsThreeVertical } from '@phosphor-icons/vue';
import type Media from '@safelight/shared/Media/Media';
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
        CurrentProject.project.value.isSimpleProject() &&
        CurrentProject.project.value.usesMedia(props.item)
);

const alertt = (text: string) => window.alert(text);

const overlay = ref<OverlayPanel>();
</script>

<style lang="scss">
#library_item_menu .p-overlaypanel-content {
    padding: 0 !important;

    > .p-menu {
        border: none;
    }
    > .p-toolbar {
        // @apply border-surface-100/10 rounded-b-none p-1;

        // border-top-width: 0;
        // border-left-width: 0;
        // border-right-width: 0;
    }
}

.bg-checkerboard {
    /* This is beautifully simple
       https://stackoverflow.com/a/65129916 */
    background: repeating-conic-gradient(#ffffff0a 0% 25%, transparent 0% 50%) 50% / 20px 20px;
}
</style>
