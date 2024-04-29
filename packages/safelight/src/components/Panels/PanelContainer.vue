<template>
    <TabMenu
        :model="menuItems"
        :active-index="activeIndex"
        :pt="{
            menu: {
                dragOver: (ev: DragEvent) => {
                    ev.preventDefault();
                    ev.stopImmediatePropagation();
                    dragOver(menuItems.length);
                }
            }
        }"
        @tab-change="
            (ev) => {
                console.log(ev.index);
                activeIndex = ev.index;
                console.log(activeIndex);
            }
        "
    >
        <template #item="{ item, props: p, index }">
            <a
                v-ripple
                v-bind="p.action"
                class="align-items-center relative flex gap-2 p-3"
                draggable="true"
                :class="{
                    insertBefore: draggingPanelIndex == index && !!draggingPanel?.panel.value,
                    insertAfter:
                        draggingPanelIndex == menuItems.length &&
                        draggingPanelIndex - 1 == index &&
                        !!draggingPanel?.panel.value
                }"
                @dragstart="dragStart"
                @dragend="dragStop"
                @dragexit="draggingPanelIndex = -1"
            >
                <component :is="item.iconComponent" />
                <span class="p-0 font-bold leading-none">{{ item.label }}</span>
                <div class="menu-item-half-target">
                    <div @dragover="dragOver(index)" />
                    <div @dragover="dragOver(index + 1)" />
                </div>
            </a>
        </template>
    </TabMenu>
    <div class="panel-container">
        <component :is="activePanel.component" v-if="activePanel?.component" />
    </div>
</template>

<script setup lang="ts">
import type { Panel } from '@/stores/useEditor';
import type { MenuItem } from 'primevue/menuitem';
import { DRAGGING_PANEL } from './injection';

const activeIndex = defineModel<number>('activeIndex', { default: 0 });

const props = defineProps<{
    panels: Panel[];
}>();

const menuItems = useArrayMap<Panel, MenuItem>(props.panels, (panel) => ({
    label: panel.name,
    iconComponent: panel.icon
}));

const activePanel = computed(() => props.panels.at(activeIndex.value));

const draggingPanel = inject(DRAGGING_PANEL);
const draggingPanelIndex = ref(-1);

function dragStart() {
    if (activePanel.value) {
        draggingPanel?.setPanel(activePanel.value);
    }
}
function dragStop() {
    if (activePanel.value) {
        draggingPanel?.setPanel(undefined);
    }
}
function dragOver(index: number) {
    if (draggingPanel?.panel.value) {
        draggingPanelIndex.value = index;
        console.log(draggingPanelIndex.value);
    }
}
</script>

<style lang="scss" scoped>
.menu-item-half-target {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    display: flex;
    > div {
        flex: 1;
    }
}

.insertBefore {
    border-left: 2px var(--primary-color) solid;
    border-top-left-radius: 0;
}
.insertAfter {
    border-right: 2px var(--primary-color) solid;
    border-top-right-radius: 0;
}
</style>
