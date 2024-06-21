<template>
    <h2 v-if="title">{{ title }}</h2>
    <vue-markdown v-if="description" :source="description" :html="false" :toc-first-level="3" />
    <div v-for="(setting, i) in settings ?? []" :key="i">
        <ArraySetting v-if="setting.type === 'array'" :setting="setting" />
        <BooleanSetting v-else-if="setting.type === 'boolean'" :setting="setting" />
        <DictionarySetting v-else-if="setting.type === 'dictionary'" :setting="setting" />
        <EnumSetting v-else-if="setting.type === 'enum'" :setting="setting" />
        <SettingsGroup
            v-else-if="setting.type === 'group'"
            :title="setting.title"
            :description="setting.description"
            :settings="setting.settings"
        />
        <NumberSetting v-else-if="setting.type === 'number'" :setting="setting" />
        <StringSetting v-else-if="setting.type === 'string'" :setting="setting" />
    </div>
</template>

<script setup lang="ts">
import type { SettingsPropertyDefinition } from '@safelight/shared/Settings/SettingsManager';
import ArraySetting from './ArraySetting.vue';
import BooleanSetting from './BooleanSetting.vue';
import DictionarySetting from './DictionarySetting.vue';
import EnumSetting from './EnumSetting.vue';
import NumberSetting from './NumberSetting.vue';
import SettingsGroup from './SettingsGroup.vue';
import VueMarkdown from 'vue-markdown-render';

defineProps<{
    title?: string;
    description?: string;
    settings: SettingsPropertyDefinition[];
}>();
</script>
