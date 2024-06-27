<template>
    <div class="flex h-full">
        <div class="overflow-y-auto">
            <Tree
                v-model:expandedKeys="expandedKeys"
                class="min-w-64"
                :selection-keys="{ [selectedPath]: true }"
                :value="tree"
                selection-mode="single"
                @node-select="onNodeSelect"
            >
            <template #nodeicon="{node}">
                <template v-if="node.data?.icon">
                    <component :is="node.data.icon" class="mr-2"/>
                </template>
            </template>
            </Tree>
        </div>
        <div
            class="mr-4 border-solid"
            style="
                border-width: 0;
                border-right-width: 1px;
                border-right-color: var(--color-border);
            "
        />
        <NamespaceSettings class="namespace" :path="selectedPath" />
    </div>
</template>

<script setup lang="ts">
import { SettingsManager, SettingsNamespace } from '@safelight/shared/Settings/SettingsManager';
import type { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';
import Tree from 'primevue/tree';
import type { TreeNode } from 'primevue/treenode';
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import NamespaceSettings from './NamespaceSettings.vue';

const selectedPath = ref<string>('general');
const expandedKeys = ref({});

const dialogRef = inject<Ref<DynamicDialogInstance>>('dialogRef');

onMounted(() => {
    if (dialogRef?.value?.data && dialogRef.value.data.namespace) {
        selectedPath.value = dialogRef.value.data.namespace
        const namespaces = selectedPath.value.split('.')
        expandedKeys.value = {}
        namespaces.forEach((ns) => {
            expandedKeys.value = {...expandedKeys.value, [ns]: true}
        })
    }
})

const tree = computed(() => {
    return (Array.from(SettingsManager.settingsDefinition.values()) as SettingsNamespace[]).map(
        (ns) => mapSettingsNs(ns)
    );
});

function onNodeSelect(data: TreeNode) {
    if (data.key) {
        if ((SettingsManager.getNamespace(data.key)?.settings?.length ?? 0) > 0) {
            selectedPath.value = data.key;
        }
        if (data.children && data.children.length > 0) {
            expandedKeys.value = { [data.key]: true };
        }
    }
}

function mapSettingsNs(ns: SettingsNamespace): TreeNode {
    return {
        key: ns.path,
        label: ns.title,
        selectable: ns.settings?.length > 0 || ns.childNamespaces?.length > 0,
        children: ns.childNamespaces?.map(mapSettingsNs),
        data: {
            icon: ns.icon
        }
    } as TreeNode;
}
</script>

<style lang="scss" scoped>
.namespace :deep(div[role='listitem']) {
    @apply ml-2;

    h3 {
        @apply mb-2 mt-0;
    }
    p {
        @apply m-0;
    }
    & > div {
        @apply ml-2;
    }
}
</style>
