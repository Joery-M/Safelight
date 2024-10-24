<template>
    <div class="panel-group-menu flex h-full flex-col">
        <div class="flex">
            <TabMenu :model="allTabs" @tab-change="activeIndex = $event.index">
                <template #item="{ item, props: iProps }">
                    <a
                        v-bind="iProps.action"
                        class="align-items-center flex min-w-36 gap-1 p-2 pr-1"
                    >
                        <component :is="item.icon" class="mr-2" />
                        <span class="flex-1 font-bold">{{ item.name }}</span>
                        <Button
                            rounded
                            text
                            severity="secondary"
                            :aria-label="'Close panel ' + item.name"
                            style="width: 20px; height: 20px; padding: 0"
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
                style="border-bottom: 1px var(--p-tabmenu-tablist-border-color) solid"
            >
                <Button
                    rounded
                    severity="secondary"
                    text
                    aria-haspopup="true"
                    aria-controls="panel_add_menu"
                    :aria-label="$t('panels.addMenu')"
                    @click="addOverlay?.toggle"
                >
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
    <Popover
        id="panel_add_menu"
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
    </Popover>
</template>

<script setup lang="ts">
import { PhPlus, PhX } from '@phosphor-icons/vue';
import PanelManager from '@safelight/shared/UI/Panels/PanelManager';
import { watchImmediate } from '@vueuse/core';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import Popover from 'primevue/popover';
import TabMenu from 'primevue/tabmenu';
import {
    computed,
    createStaticVNode,
    createTextVNode,
    defineAsyncComponent,
    ref,
    shallowRef,
    type Component,
    type ComponentInstance,
    type StyleValue
} from 'vue';
import { type Panel, type PanelGroupConfig } from './injection';
import LoadingPanel from './LoadingPanel.vue';

const props = defineProps<{
    config: PanelGroupConfig;
    groupStyle?: StyleValue;
}>();

const activeIndex = ref(0);

const allTabs = computed<MenuItem[]>(() => {
    const panelGroup = props.config;
    if (!panelGroup) return [];

    return panelGroup.panels
        .sort((p1, p2) => p1.order - p2.order)
        .map(({ panelId }) => PanelManager.allPanels.get(panelId))
        .filter((p) => !!p) as unknown as MenuItem[];
});

const activeTab = computed(() => {
    const panelGroup = props.config;
    if (!panelGroup) return;

    const panel = panelGroup.panels[activeIndex.value];
    return panel;
});

const activeComponent = shallowRef<Component>();
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

const addOverlay = ref<ComponentInstance<typeof Popover>>();

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
.panel-group-menu {
    .p-tabmenu-item-link {
        .p-button {
            opacity: 0;
            visibility: hidden;
            transition: opacity 250ms 0s;
        }

        &:hover,
        &:focus-within,
        &:focus-visible {
            .p-button {
                opacity: 1;
                visibility: visible;
            }
        }
    }
}

.p-tabmenu {
    scrollbar-width: none;
}
</style>
