<template>
    <h3 v-if="setting?.title" :id="setting.name + '-title'">{{ setting.title }}</h3>
    <vue-markdown
        v-if="setting?.description"
        :id="setting.name + '-description'"
        :source="setting.description"
    />
    <Checkbox
        :model-value="checkboxValue"
        :binary="true"
        :pt="{
            input: {
                'aria-describedby': setting.name + '-description'
            }
        }"
        :aria-labelledby="setting.name + '-title'"
        @change="changeValue()"
    />
</template>

<script lang="ts" setup>
import {
    SettingsManager,
    type SettingsBoolProperty
} from '@safelight/shared/Settings/SettingsManager';
import Checkbox from 'primevue/checkbox';
import VueMarkdown from 'vue-markdown-render';

const props = defineProps<{ namespace: string[]; setting: SettingsBoolProperty }>();

const checkboxValue = SettingsManager.getSetting([...props.namespace, props.setting.name]);

function changeValue() {
    SettingsManager.setSetting([...props.namespace, props.setting.name], !checkboxValue.value);
}
</script>
