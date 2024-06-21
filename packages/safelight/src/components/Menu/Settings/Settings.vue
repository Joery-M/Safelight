<template>
    <Tree :value="tree" />
    <SettingsNamespaceItem />
</template>

<script setup lang="ts">
import { SettingsManager, SettingsNamespace } from '@safelight/shared/Settings/SettingsManager';
import type { TreeNode } from 'primevue/treenode';

const tree = computed(() => {
    return (Array.from(SettingsManager.settingsDefinition.values()) as SettingsNamespace[])
        .filter((ns) => ns.path.length <= 1)
        .map((ns) => mapSettingsNs(ns));
});

function mapSettingsNs(ns: SettingsNamespace): TreeNode {
    return {
        key: ns.path.join('.'),
        label: ns.title,
        children: ns.childNamespaces?.map(mapSettingsNs)
    } as TreeNode;
}
</script>
