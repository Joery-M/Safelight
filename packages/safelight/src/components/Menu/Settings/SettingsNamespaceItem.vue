<template>
    <li>
        <pre>{{ currentLevelNamespaces }}</pre>
        <template v-for="ns in currentLevelNamespaces" :key="ns.path.join('.')">
            {{ index }} {{ ns.path.join('.') }}:
            <SettingsNamespaceComp :path="ns.path" :index="index + 1" />
        </template>
    </li>
</template>

<script setup lang="ts">
import { SettingsManager, SettingsNamespace } from '@safelight/shared/Settings/SettingsManager';
import SettingsNamespaceItem from './SettingsNamespaceItem.vue';

const props = withDefaults(defineProps<{ path: string[]; index: number }>(), {
    path: () => [],
    index: () => 0
});

const currentLevelNamespaces = computed(() => {
    if (props.path.length > 0) {
        return (SettingsManager.settingsDefinition.get(props.path)?.childNamespaces ??
            []) as SettingsNamespace[];
    } else {
        return Array.from(SettingsManager.settingsDefinition.values()).filter(
            (ns) => ns.path.length <= 1
        ) as SettingsNamespace[];
    }
});
</script>
