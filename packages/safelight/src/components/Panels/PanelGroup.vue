<template>
    <div class="panel-group-menu h-full flex flex-col">
        <div class="flex">
            <TabMenu :model="allTabs" @tab-change="activeIndex = $event.index">
                <template #item="{ item, props: iProps }">
                    <a v-bind="iProps.action" class="min-w-36 flex items-center gap-1 p-2 pr-1">
                        <i v-if="item.icon" :class="item.icon" class="mr-2" />
                        <span class="flex-1 font-bold">{{ item.name }}</span>
                        <Button
                            text
                            rounded
                            severity="secondary"
                            icon="i-ph-x size-4"
                            :aria-label="'Close panel ' + item.name"
                            style="width: 20px; height: 20px; padding: 0"
                            @click.stop="removePanel(item as unknown as Panel)"
                        />
                    </a>
                </template>
            </TabMenu>
            <div
                class="flex flex-1 items-center justify-start"
                style="border-bottom: 1px var(--p-tabmenu-tablist-border-color) solid"
            >
                <Button
                    severity="secondary"
                    text
                    rounded
                    aria-haspopup="true"
                    aria-controls="panel_add_menu"
                    :aria-label="$t('panels.addMenu')"
                    icon="i-ph-plus"
                    @click="addOverlay?.toggle"
                />
            </div>
        </div>
        <div class="relative min-h-0 flex-1">
            <Suspense>
                <component :is="activeComponent" v-if="activeComponent" />

                <template #fallback>
                    <LoadingPanel />
                </template>
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
                <i v-if="item.icon" :class="item.icon" class="mr-2" />
            </template>
        </Menu>
    </Popover>
</template>

<script setup lang="ts">
import PanelManager from '@safelight/shared/UI/Panels/PanelManager';
import { watchImmediate } from '@vueuse/core';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import type { MenuItem } from 'primevue/menuitem';
import Popover from 'primevue/popover';
import TabMenu from 'primevue/tabmenu';
import {
    computed,
    defineAsyncComponent,
    ref,
    shallowRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Suspense,
    useTemplateRef,
    type Component,
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

    const panel = PanelManager.allPanels.get(tab.panelId ?? '');
    if (panel) {
        activeComponent.value = defineAsyncComponent(panel.component);
    } else {
        activeComponent.value = undefined;
    }
});

const allAvailablePanels = computed<MenuItem[]>(() =>
    Array.from(PanelManager.allPanels.values()).map<MenuItem>((panel) => ({
        command: () => addPanel(panel),
        icon: panel.icon,
        label: panel.name
    }))
);

const addOverlay = useTemplateRef('addOverlay');

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
