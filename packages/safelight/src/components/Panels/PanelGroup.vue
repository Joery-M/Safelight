<template>
    <div :style="groupStyle">
        <Suspense>
            <component :is="activeComponent" />
            <template #fallback>
                <div class="grid h-full w-full place-content-center">
                    <PhCircleNotch class="animate-spin" aria-label="Loading" size="48" />
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import type { Panel } from '@/stores/useEditor';
import type { StyleValue } from 'vue';
import { DRAGGING_PANEL } from './injection';

const activeDragPanel = ref<Panel>();

const dragPanel = provide(DRAGGING_PANEL, {
    panel: activeDragPanel,
    setPanel: (panel) => {
        activeDragPanel.value = panel;
    }
});

const editor = useEditor();

const activeComponent = computed(() => PanelManager.allPanels.get(activeTab.value)?.component);

const activeTab = computed(() => {
    const panel = editor.activePanels[props.id];
    return panel?.panels[panel.activeIndex];
});

const props = defineProps<{
    id: string;
    groupStyle?: StyleValue;
}>();
</script>
