<template>
    <TreeSelect v-model="propValue" :options="fileTree" />
</template>

<script setup lang="ts">
import { useProject } from '@/stores/useProject';
import type { MediaPropertyConfig } from '@safelight/shared/Effects/Properties';
import type { SLEffectProperty } from '@safelight/shared/Effects/transformEffect';
import type { FileTreeItem } from '@safelight/shared/Project/ProjectFileTree';
import type { EffectInstance } from '@safelight/shared/Effects/effectInstance';
import type { SourceEffectInstance } from '@safelight/shared/Effects/SourceEffectInstance';
import { TreeSelect } from 'primevue';
import type { TreeNode } from 'primevue/treenode';
import { computed, defineProps } from 'vue';

const project = useProject();
const props = defineProps<{
    propKey: string;
    prop: SLEffectProperty<string | null, MediaPropertyConfig>;
    effect: SourceEffectInstance | EffectInstance;
}>();

const propValue = computed({
    get() {
        const val = props.effect.calculatePropertyValue(
            project.timeline!.pbPos.value,
            props.propKey
        );
        if (val) {
            return { [val]: true };
        } else {
            return {};
        }
    },
    set(v: Record<string, boolean>) {
        const key = Object.keys(v)[0];
        props.prop.setValue(key || null);
        props.effect.setKeyframe(project.timeline!.pbPos.value, props.propKey, key || null);
    }
});

// TODO: use a better system than this
const fileTree = computed(() => {
    if (!project.p) return [];

    const traverse = (treeItems: FileTreeItem[]) => {
        const items: TreeNode[] = [];
        treeItems.forEach((treeItem) => {
            if (treeItem.isDirectory) {
                const children = traverse(Array.from(treeItem.children.values()));
                if (children.length > 0) {
                    items.push({
                        key: treeItem.id,
                        selectable: false,
                        label: treeItem.name.value,
                        children
                    });
                }
            } else if (treeItem.media.value) {
                const isAllowed =
                    props.prop.meta?.allowedTypes && props.prop.meta.allowedTypes.length > 0
                        ? props.prop.meta.allowedTypes.includes(treeItem.media.value.type)
                        : true;

                if (isAllowed) {
                    items.push({
                        key: treeItem.id,
                        label: treeItem.name.value,
                        data: treeItem.media.value,
                        selectable: true
                    });
                }
            }
        });

        return items;
    };

    return traverse(Array.from(project.p.fileTree.children.values()));
});
</script>
