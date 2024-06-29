<template>
    <Splitter
        :layout="config.splitDirection"
        :pt="{
            root: {
                style: 'min-height: 0; height: 100%; border-radius: 0;'
            }
        }"
        @resize="clearSelection"
        @resizestart="dragStart"
        @resizeend="dragEnd"
    >
        <SplitterPanel v-for="(split, i) in config.split" :key="i" :min-size="5">
            <PanelContainer v-if="'splitDirection' in split" :config="split" />
            <PanelGroup v-else :config="split" />
        </SplitterPanel>
    </Splitter>
</template>

<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import type { PanelSplitConfig } from './injection';
import PanelGroup from './PanelGroup.vue';

defineProps<{
    config: PanelSplitConfig;
}>();

// Save the selection range for when the drag ends
// Could just remove the ranges when dragging, but this is nicer IMO
let originalSelection: Range[] = [];

function dragStart() {
    originalSelection = [];
    for (let index = 0; index < (getSelection()?.rangeCount ?? 0); index++) {
        const element = getSelection()?.getRangeAt(index);
        if (element) {
            originalSelection.push(element);
        }
    }
}
function dragEnd() {
    originalSelection.forEach((range) => {
        getSelection()?.addRange(range);
    });
}
function clearSelection() {
    getSelection()?.removeAllRanges();
}
</script>
