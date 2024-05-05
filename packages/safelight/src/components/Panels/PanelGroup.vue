<template>
    <div class="flex h-full flex-col">
        <!-- @vue-expect-error Its fine -->
        <TabMenu :model="allTabs">
            <!-- eslint-disable-next-line vue/no-template-shadow -->
            <template #item="{ item, props, index }">
                <a
                    v-ripple
                    v-bind="props.action"
                    class="align-items-center flex gap-1 p-2 px-3"
                    @click="activeIndex = index"
                >
                    <component :is="item.icon" class="mr-2" />
                    <span class="font-bold">{{ item.name }}</span>
                </a>
            </template>
        </TabMenu>
        <div class="relative min-h-0 flex-1">
            <Suspense>
                <component :is="activeComponent" />
            </Suspense>
        </div>
    </div>
</template>

<script setup lang="ts">
import PanelManager from '@safelight/shared/UI/Panels/PanelManager';
import { createStaticVNode, createTextVNode, type StyleValue } from 'vue';
import { type Panel, type PanelGroupConfig } from './injection';
import LoadingPanel from './LoadingPanel.vue';

const props = defineProps<{
    config: PanelGroupConfig;
    groupStyle?: StyleValue;
}>();

const activeIndex = ref(0);

const allTabs = computed<Panel[]>(() => {
    const panelGroup = props.config;
    if (!panelGroup) return [];

    return panelGroup.panels
        .sort((p1, p2) => p1.order - p2.order)
        .map(({ panelId }) => PanelManager.allPanels.get(panelId))
        .filter((p) => !!p);
});

const activeTab = computed(() => {
    const panelGroup = props.config;
    if (!panelGroup) return;

    const panel = panelGroup.panels[activeIndex.value];
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
