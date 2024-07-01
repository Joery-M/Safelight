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
        :class="{ show: defaultValue !== numberValue }"
        class="default"
        aria-label="Reset value"
        tabindex="0"
        role="button"
        @click="
            $event.preventDefault();
            changeValue(defaultValue);
        "
    >
        (Default: {{ defaultValue }})
        <PhArrowUDownLeft size="15" />
    </a>
    <div class="number-slider-combo">
        <InputNumber
            :model-value="numberValue"
            :min="setting.min"
            :max="setting.max"
            :max-fraction-digits="setting.decimals == false ? 0 : setting.decimals ?? 20"
            show-buttons
            class="w-32"
            input-class="w-32"
            :aria-labelledby="setting.name + '-title'"
            @update:model-value="changeValue"
        />
        <Slider
            v-if="useRange"
            :model-value="numberValue"
            :aria-labelledby="setting.name + '-title'"
            :min="setting.min"
            :max="setting.max"
            @update:model-value="changeValue($event as number)"
        />
    </div>
</template>

<script lang="ts" setup>
import { PhArrowUDownLeft } from '@phosphor-icons/vue';
import {
    SettingsManager,
    type SettingsNumberProperty
} from '@safelight/shared/Settings/SettingsManager';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import { computed } from 'vue';
import VueMarkdown from 'vue-markdown-render';

const props = defineProps<{ namespace: string[]; setting: SettingsNumberProperty }>();

const numberValue = SettingsManager.getSetting([...props.namespace, props.setting.name]);
const defaultValue = props.setting.default;

function changeValue(value: number) {
    if (value == null) {
        return;
    }
    SettingsManager.setSetting([...props.namespace, props.setting.name], value);
}

const useRange = computed(
    () => props.setting.range && props.setting.min != null && props.setting.max != null
);
</script>

<style lang="scss" scoped>
.number-slider-combo {
    display: flex;
    width: calc(100% - 2em);
    align-items: center;

    gap: 1em;

    > .p-slider {
        @apply mr-0 max-w-96;
        flex-grow: 1;
    }
}
</style>
