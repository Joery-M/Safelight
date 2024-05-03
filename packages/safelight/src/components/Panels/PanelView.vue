<template>
    <PanelContainer
        :config="{
            splitDirection: 'vertical',
            split: panelConfig
        }"
    />
</template>

<script setup lang="ts">
import { PANEL_CONFIG, type PanelViewConfig } from './injection';

const props = defineProps<{
    panelConfig: PanelViewConfig;
}>();
/*
Structure examples:
+---+-----+
|   |  2  |
+ 1 +-----+
|   |  3  |
+---+-----+

splits = [
    {
        type: 'horizontal',
        splits: [
            'panel-id1',
            {
                type: 'vertical',
                splits: [
                    'panel-id2',
                    'panel-id3'
                ]
            }
        ]
    }
]


*/

// const splits = reactive([] as VerticalSplit[]);

provide(PANEL_CONFIG, props.panelConfig);

interface VerticalSplit {
    type: 'vertical';
    splits: (HorizontalSplit | string)[];
}

interface HorizontalSplit {
    type: 'horizontal';
    splits: (VerticalSplit | string)[];
}
</script>

<style lang="scss">
.horizontalGroup {
    display: flex;
    > * {
        flex: 1;
    }
}
.verticalGroup {
    display: flex;
    flex-direction: column;
}
</style>
