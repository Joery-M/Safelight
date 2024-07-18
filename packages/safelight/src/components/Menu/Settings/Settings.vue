<template>
    <div class="flex h-full">
        <div class="tree">
            <Tree
                v-model:expandedKeys="expandedKeys"
                class="min-w-64"
                :selection-keys="{ [selectedPath]: true }"
                :value="tree"
                selection-mode="single"
                @node-select="onNodeSelect"
            >
                <template #nodeicon="{ node }">
                    <template v-if="node.data?.icon">
                        <component :is="node.data.icon" class="mr-2" />
                    </template>
                </template>
            </Tree>
            <Button severity="secondary" @click="SettingsManager.downloadSettings()">
                <PhDownload />
                Download JSON
            </Button>
        </div>
        <div
            class="mr-4 border-solid"
            style="
                border-width: 0;
                border-right-width: 1px;
                border-right-color: var(--p-surface-700);
            "
        />
        <NamespaceSettings class="namespace" :path="selectedPath" />
    </div>
</template>

<script setup lang="ts">
import { PhDownload } from '@phosphor-icons/vue';
import { SettingsManager, SettingsNamespace } from '@safelight/shared/Settings/SettingsManager';
import Button from 'primevue/button';
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
        selectedPath.value = dialogRef.value.data.namespace;
        const namespaces = selectedPath.value.split('.');
        expandedKeys.value = {};
        namespaces.forEach((ns) => {
            expandedKeys.value = { ...expandedKeys.value, [ns]: true };
        });
    }
});

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
.tree {
    @apply mr-4 flex flex-col;
    > .p-tree {
        @apply flex-1 overflow-y-auto;
    }
    > .p-button {
        @apply flex w-full justify-center gap-2;
    }
}

.namespace :deep(div[role='listitem']) {
    @apply mb-4 pl-4;

    h3 {
        @apply -ml-2 mb-3 mt-0;
    }
    p {
        @apply m-0;
    }
    .description {
        line-height: normal;
    }

    a.default {
        @apply invisible cursor-pointer align-middle text-sm font-extralight italic opacity-0 transition-all;

        &.show {
            @apply visible opacity-100;
        }
        > svg {
            @apply align-middle;
        }
    }
}
</style>
