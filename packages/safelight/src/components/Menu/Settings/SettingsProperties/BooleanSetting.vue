<template>
    <h3 v-if="setting?.title" :id="setting.name + '-title'">{{ setting.title }}</h3>
    <vue-markdown
        v-if="setting?.description"
        :id="setting.name + '-description'"
        class="description"
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
        @change="changeValue(!checkboxValue)"
    />
    <a
        v-if="defaultValue !== undefined"
        :class="{ show: defaultValue !== checkboxValue }"
        class="default"
        :aria-label="$t('general.actions.resetValue')"
        tabindex="0"
        role="button"
        @click="
            $event.preventDefault();
            changeValue(defaultValue);
        "
    >
        ({{ $t('general.default') }}: {{ defaultValue }})
        <i class="ph ph-arrow-u-down-left" style="font-size: 15px" />
    </a>
</template>

<script lang="ts" setup>
import {
    SettingsManager,
    type SettingsBoolProperty
} from '@safelight/shared/Settings/SettingsManager';
import Checkbox from 'primevue/checkbox';
import VueMarkdown from 'vue-markdown-render';

const props = defineProps<{ namespace: string[]; setting: SettingsBoolProperty }>();

const checkboxValue = SettingsManager.getSetting<boolean>([...props.namespace, props.setting.name]);
const defaultValue = props.setting.default;

function changeValue(value: boolean) {
    SettingsManager.setSetting([...props.namespace, props.setting.name], value);
}
</script>

<style lang="scss" scoped>
.description {
    @apply mb-2;
}
</style>
