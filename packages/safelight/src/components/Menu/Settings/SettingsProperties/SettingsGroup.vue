<template>
    <h2 v-if="title">{{ title }}</h2>
    <vue-markdown v-if="description" :source="description" :html="false" />
    <template v-for="(setting, i) in settings ?? []" :key="i">
        <div role="listitem">
            <ArraySetting v-if="setting.type === 'array'" :namespace :setting />
            <BooleanSetting v-else-if="setting.type === 'boolean'" :namespace :setting />
            <DictionarySetting v-else-if="setting.type === 'dictionary'" :namespace :setting />
            <EnumSetting v-else-if="setting.type === 'enum'" :namespace :setting />
            <SettingsGroup
                v-else-if="setting.type === 'group'"
                :title="setting.title"
                :description="setting.description"
                :settings="setting.settings"
                :namespace
            />
            <NumberSetting v-else-if="setting.type === 'number'" :namespace :setting />
            <StringSetting v-else-if="setting.type === 'string'" :namespace :setting />
            <Suspense v-else-if="setting.type === 'custom'">
                <component :is="setting.component" :setting />
            </Suspense>
        </div>
    </template>
</template>

<script setup lang="ts">
import type { SettingsPropertyDefinition } from '@safelight/shared/Settings/SettingsManager';
import VueMarkdown from 'vue-markdown-render';
import ArraySetting from './ArraySetting.vue';
import BooleanSetting from './BooleanSetting.vue';
import DictionarySetting from './DictionarySetting.vue';
import EnumSetting from './EnumSetting.vue';
import NumberSetting from './NumberSetting.vue';
import SettingsGroup from './SettingsGroup.vue';
import StringSetting from './StringSetting.vue';

defineProps<{
    title?: string;
    description?: string;
    namespace: string[];
    settings: SettingsPropertyDefinition[];
}>();
</script>
