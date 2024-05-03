<template>
    <Suspense>
        <component :is="activeComponent" />
    </Suspense>
</template>

<script setup lang="ts">
import { createStaticVNode, createTextVNode, type StyleValue } from 'vue';
import { DRAGGING_PANEL, type Panel, type PanelGroupConfig } from './injection';
import LoadingPanel from './LoadingPanel.vue';

const props = defineProps<{
    config: PanelGroupConfig;
    groupStyle?: StyleValue;
}>();

const activeDragPanel = ref<Panel>();

const dragPanel = provide(DRAGGING_PANEL, {
    panel: activeDragPanel,
    setPanel: (panel) => {
        activeDragPanel.value = panel;
    }
});

const activeTab = computed(() => {
    const panelGroup = props.config;
    if (!panelGroup) return;

    const panel = panelGroup.panels[panelGroup.activePanelIndex];
    return panel;
});

const activeComponent = ref<Component>();
watchImmediate(activeTab, (tab) => {
    if (!tab) return;

    activeComponent.value = defineAsyncComponent({
        loader:
            PanelManager.allPanels.get(tab.panelId ?? '')?.component ??
            (async () =>
                createStaticVNode(
                    `<div style="flex: 1; display: grid; place-items: center; height: 100%;">${tab.panelId}</div>`,
                    1
                )),
        loadingComponent: LoadingPanel,
        suspensible: true,
        errorComponent: createTextVNode(tab.panelId),
        timeout: 3000
    });
});
</script>
