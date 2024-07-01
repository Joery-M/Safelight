<template>
    <div v-if="currentSettings" ref="scrollContainer" class="h-full flex-1 overflow-y-auto">
        <h1 class="mt-0">
            {{ currentSettings.title }}
        </h1>
        <vue-markdown
            v-if="currentSettings.description"
            :source="currentSettings.description"
            :html="false"
        />
        <div v-if="currentSettings.settings" role="list">
            <SettingsGroup
                :settings="currentSettings.settings"
                :namespace="currentSettings.pathArray"
                :is-first="true"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { SettingsManager } from '@safelight/shared/Settings/SettingsManager';
import { computed, ref, watch } from 'vue';
import VueMarkdown from 'vue-markdown-render';
import SettingsGroup from './SettingsProperties/SettingsGroup.vue';

const props = withDefaults(defineProps<{ path: string }>(), {
    path: () => 'general'
});

const scrollContainer = ref<HTMLDivElement>();

const currentSettings = computed(() => SettingsManager.getNamespace(props.path));

watch(currentSettings, () => {
    if (scrollContainer.value) {
        scrollContainer.value.scrollTo(0, 0);
    }
});
</script>
