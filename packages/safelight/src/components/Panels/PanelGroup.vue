<template>
    <div class="flex h-full flex-col">
        <div class="flex">
            <!-- @vue-expect-error Its fine -->
            <TabMenu :model="allTabs">
                <!-- eslint-disable-next-line vue/no-template-shadow -->
                <template #item="{ item, props, index }">
                    <a
                        v-ripple
                        v-bind="props.action"
                        class="align-items-center flex min-w-36 gap-1 p-2 pl-2 pr-1"
                        @click="activeIndex = index"
                    >
                        <component :is="item.icon" class="mr-2" />
                        <span class="flex-1 font-bold">{{ item.name }}</span>
                        <Button
                            rounded
                            text
                            severity="contrast"
                            class="transition-opacity"
                            style="width: 20px; height: 20px; padding: 0; opacity: 0"
                            @click="removePanel(item as unknown as Panel)"
                        >
                            <template #icon>
                                <PhX size="14" />
                            </template>
                        </Button>
                    </a>
                </template>
            </TabMenu>
            <div
                class="flex flex-1 items-center justify-start"
                style="border-bottom: 1px var(--surface-100) solid"
            >
                <Button rounded severity="contrast" text @click="addOverlay?.toggle">
                    <template #icon>
                        <PhPlus />
                    </template>
                </Button>
            </div>
        </div>
        <div class="relative min-h-0 flex-1">
            <Suspense>
                <component :is="activeComponent" />
            </Suspense>
        </div>
    </div>
    <OverlayPanel
        ref="addOverlay"
        :pt="{
            content: {
                style: 'padding: 0'
            }
        }"
    >
        <Menu
            :model="allAvailablePanels"
            :pt="{
                root: {
                    style: 'border: none;'
                }
            }"
        >
            <template #itemicon="{ item }">
                <component :is="item.icon" class="mr-2" />
            </template>
        </Menu>
    </OverlayPanel>
</template>

<script setup lang="ts">
import PanelManager from '@safelight/shared/UI/Panels/PanelManager';
import { createStaticVNode, createTextVNode, type StyleValue } from 'vue';
import { type Panel, type PanelGroupConfig } from './injection';
import LoadingPanel from './LoadingPanel.vue';
import type OverlayPanel from 'primevue/overlaypanel';
import type { MenuItem } from 'primevue/menuitem';

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

const allAvailablePanels = computed<MenuItem[]>(() =>
    Array.from(PanelManager.allPanels.values()).map<MenuItem>((panel) => ({
        command: () => addPanel(panel),
        icon: panel.icon as any,
        label: panel.name
    }))
);

const addOverlay = ref<OverlayPanel>();

// TODO: Be able to send a signal to the top level to remove a panel from the group
// OR, be able to modify the local config to affect the top config.
function removePanel(panel: Panel) {
    console.log('Remove', panel);
}
function addPanel(panel: Panel) {
    console.log('Add', panel);
}
</script>

<style lang="scss">
.p-menuitem-link:hover .p-button {
    opacity: 1 !important;
}
</style>
