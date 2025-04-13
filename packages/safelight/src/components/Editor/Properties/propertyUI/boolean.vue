<template>
    <Checkbox
        :model-value="prop.displayValue ? prop.displayValue() : prop.value()"
        @value-change="prop.setValue($event)"
    />
</template>

<script setup lang="ts">
import type { SLEffectProperty } from '@safelight/shared/Effects/transformEffect';
import { Checkbox } from 'primevue';
import { defineProps } from 'vue';

defineProps<{ prop: SLEffectProperty<boolean> }>();
</script>
