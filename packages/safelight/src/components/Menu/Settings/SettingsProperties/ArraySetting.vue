<template>
    <h3 v-if="setting?.title">{{ setting.title }}</h3>
    <vue-markdown v-if="setting?.description" :source="setting.description" />
</template>

<script lang="ts" setup>
import type { SettingsArrayProperty } from '@safelight/shared/Settings/SettingsManager';
import VueMarkdown from 'vue-markdown-render';

defineProps<{ namespace: string[]; setting: SettingsArrayProperty }>();
</script>
