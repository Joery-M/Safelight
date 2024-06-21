<template>
    <div class="flex h-full">
        <div class="overflow-y-auto">
            <Tree
                v-model:expandedKeys="expandedKeys"
                class="w-64"
                :selection-keys="{ [selectedPath]: true }"
                :value="tree"
                selection-mode="single"
                @node-select="onNodeSelect"
            />
        </div>
        <div
            class="mr-4 border-solid"
            style="
                border-width: 0;
                border-right-width: 1px;
                border-right-color: var(--color-border);
            "
        ></div>
        <NamespaceSettings :path="selectedPath" />
    </div>
</template>

<script setup lang="ts">
import { SettingsManager, SettingsNamespace } from '@safelight/shared/Settings/SettingsManager';
import Tree from 'primevue/tree';
import type { TreeNode } from 'primevue/treenode';

const selectedPath = ref<string>('general');
const expandedKeys = ref({});

function onNodeSelect(data: TreeNode) {
    if (data.key) {
        selectedPath.value = data.key;
        if ((data.children ?? []).length > 0) {
            expandedKeys.value = { ...expandedKeys.value, [data.key]: true };
        }
    }
}

const tree = computed(() => {
    return (Array.from(SettingsManager.settingsDefinition.values()) as SettingsNamespace[])
        .filter((ns) => ns.path.split('.').length <= 1)
        .map((ns) => mapSettingsNs(ns));
});

function mapSettingsNs(ns: SettingsNamespace): TreeNode {
    return {
        key: ns.path,
        label: ns.title,
        children: ns.childNamespaces?.map(mapSettingsNs)
    } as TreeNode;
}
</script>
