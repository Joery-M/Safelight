<template>
    <div v-if="currentSettings" class="h-full flex-1 overflow-y-scroll">
        <h1 class="mt-0">
            {{ currentSettings.title }}
        </h1>
        <vue-markdown
            v-if="currentSettings.description"
            :source="currentSettings.description"
            :html="false"
        />
        <div>
            <SettingsGroup :settings="currentSettings.settings" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import SettingsGroup from './SettingsProperties/SettingsGroup.vue';
import VueMarkdown from 'vue-markdown-render';

const props = withDefaults(defineProps<{ path: string }>(), {
    path: () => 'general'
});

const currentSettings = computed(() => SettingsManager.settingsDefinition.get(props.path));
</script>
