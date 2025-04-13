<template>
    <InputNumber
        v-if="!prop.meta?.slider"
        :model-value="prop.displayValue ? prop.displayValue() : prop.value()"
        :max-fraction-digits="prop.meta?.integerOnly ? 0 : 10"
        :min="prop.meta?.min"
        :max="prop.meta?.max"
        :step="prop.meta?.step"
        @value-change="prop.setValue($event)"
    />
    <Slider
        v-else
        :model-value="prop.displayValue ? prop.displayValue() : prop.value()"
        :min="prop.meta?.min"
        :max="prop.meta?.max"
        :step="prop.meta?.step"
        @value-change="prop.setValue(Array.isArray($event) ? $event[0] : $event)"
    />
</template>

<script setup lang="ts">
import type { NumberPropertyConfig } from '@safelight/shared/Effects/Properties';
import type { SLEffectProperty } from '@safelight/shared/Effects/transformEffect';
import { InputNumber, Slider } from 'primevue';
import { defineProps } from 'vue';

defineProps<{ prop: SLEffectProperty<number, NumberPropertyConfig> }>();
</script>
