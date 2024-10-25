<template>
    <h3 v-if="setting?.title" :id="setting.name + '-title'">{{ setting.title }}</h3>
    <vue-markdown
        v-if="setting?.description"
        :id="setting.name + '-description'"
        class="description"
        :source="setting.description"
    />
    <a
        v-if="defaultValue !== undefined"
        :class="{ show: defaultValue !== stringValue }"
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
    <InputText
        v-if="!setting.multiline"
        class="input"
        :model-value="stringValue"
        :invalid="invalid"
        :pt="{
            root: {
                'aria-describedby': setting.name + '-description'
            }
        }"
        :aria-labelledby="setting.name + '-title'"
        @update:model-value="changeValue($event)"
    />
    <TextArea
        v-else
        class="input max-w-full"
        :model-value="stringValue"
        :invalid="invalid"
        :pt="{
            root: {
                'aria-describedby': setting.name + '-description'
            }
        }"
        :aria-labelledby="setting.name + '-title'"
        rows="6"
        cols="40"
        auto-resize
        @update:model-value="changeValue($event)"
    />
</template>

<script lang="ts" setup>
import {
    SettingsManager,
    type SettingsStringProperty
} from '@safelight/shared/Settings/SettingsManager';
import { watchImmediate } from '@vueuse/core';
import InputText from 'primevue/inputtext';
import TextArea from 'primevue/textarea';
import { ref } from 'vue';
import VueMarkdown from 'vue-markdown-render';

const props = defineProps<{ namespace: string[]; setting: SettingsStringProperty }>();

const stringValue = ref('');
const storedStringValue = SettingsManager.getSetting<string>([
    ...props.namespace,
    props.setting.name
]);
const defaultValue = props.setting.default;

const invalid = ref(false);

function changeValue(value?: string) {
    if (value == undefined) {
        return;
    }
    let matchesRegex = true;
    let minLength = true;
    let maxLength = true;

    if (props.setting.pattern) {
        const pattern = new RegExp(props.setting.pattern);
        matchesRegex = pattern.test(value);
    }
    if (props.setting.minLength != undefined) {
        minLength = value.length < props.setting.minLength;
    }
    if (props.setting.maxLength != undefined) {
        maxLength = value.length < props.setting.maxLength;
    }

    invalid.value = !(matchesRegex && minLength && maxLength);
    stringValue.value = value;
    if (!invalid.value) {
        if (props.setting.autoTrim) {
            SettingsManager.setSetting([...props.namespace, props.setting.name], value.trim());
        } else {
            SettingsManager.setSetting([...props.namespace, props.setting.name], value);
        }
    }
}

watchImmediate(storedStringValue, (val) => {
    stringValue.value = val;
});
</script>

<style lang="scss" scoped>
.input {
    display: block;
    &.p-invalid {
        outline-color: #fca5a5 !important;
    }
}
</style>
