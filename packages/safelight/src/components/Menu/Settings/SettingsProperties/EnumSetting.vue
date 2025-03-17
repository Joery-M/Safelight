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
        :class="{ show: defaultValue !== enumValue }"
        class="default"
        :aria-label="$t('general.actions.resetValue')"
        tabindex="0"
        role="button"
        @click="
            $event.preventDefault();
            changeValue(defaultValue);
        "
    >
        ({{ $t('general.default') }}:
        {{ setting.labelKey ? getByPath(defaultValue, setting.labelKey) : defaultValue }})
        <div class="i-ph-arrow-u-down-left size-3.5 inline-block v-middle" />
    </a>
    <Select
        :model-value="enumValue"
        :options="setting.options"
        :option-label="setting.labelKey"
        class="w-56"
        :aria-labelledby="setting.name + '-title'"
        @update:model-value="changeValue"
    />
</template>

<script lang="ts" setup>
import {
    SettingsManager,
    type SettingsEnumProperty
} from '@safelight/shared/Settings/SettingsManager';
import { getByPath } from 'dot-path-value';
import Select from 'primevue/select';
import { computed } from 'vue';
import VueMarkdown from 'vue-markdown-render';

const props = defineProps<{ namespace: string[]; setting: SettingsEnumProperty }>();

const enumValue = computed(() => {
    const value = SettingsManager.getSetting<'top' | 'bottom'>([
        ...props.namespace,
        props.setting.name
    ]);
    return props.setting.options.find(
        (o) => (props.setting.valueKey ? getByPath(o, props.setting.valueKey) : o) == value.value
    );
});
const defaultValue = props.setting.options.find(
    (o) =>
        (props.setting.valueKey ? getByPath(o, props.setting.valueKey) : o) == props.setting.default
);

function changeValue(value: any) {
    SettingsManager.setSetting(
        [...props.namespace, props.setting.name],
        props.setting.valueKey ? getByPath(value, props.setting.valueKey) : value
    );
}
</script>

<style lang="scss" scoped>
.default {
    display: block;
}
</style>
