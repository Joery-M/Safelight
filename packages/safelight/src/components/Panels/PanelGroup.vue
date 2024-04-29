<template>
    <slot />
</template>

<script setup lang="ts">
import type { Panel } from '@/stores/useEditor';
import { DRAGGING_PANEL } from './injection';

const activeDragPanel = ref<Panel>();

const dragPanel = provide(DRAGGING_PANEL, {
    panel: activeDragPanel,
    setPanel: (panel) => {
        activeDragPanel.value = panel;
    }
});
</script>
