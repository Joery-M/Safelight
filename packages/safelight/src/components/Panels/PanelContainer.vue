<template>
    <Splitter
        :layout="config.splitDirection"
        :pt="{
            root: {
                style: 'min-height: 0; height: 100%;'
            }
        }"
    >
        <SplitterPanel v-for="(split, i) in config.split" :key="i">
            <PanelContainer v-if="'splitDirection' in split" :config="split" />
            <PanelGroup v-else :config="split" />
        </SplitterPanel>
    </Splitter>
</template>

<script setup lang="ts">
import type { PanelSplitConfig } from './injection';

defineProps<{
    config: PanelSplitConfig;
}>();
</script>
