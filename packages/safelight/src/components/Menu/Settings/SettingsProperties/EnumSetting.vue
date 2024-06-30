<template>
    <h3 v-if="setting?.title" :id="setting.name + '-title'">{{ setting.title }}</h3>
    <vue-markdown
        v-if="setting?.description"
        :id="setting.name + '-description'"
        :source="setting.description"
    />
</template>

<script lang="ts" setup>
import type { SettingsEnumProperty } from '@safelight/shared/Settings/SettingsManager';
import VueMarkdown from 'vue-markdown-render';

defineProps<{ namespace: string[]; setting: SettingsEnumProperty }>();
</script>
