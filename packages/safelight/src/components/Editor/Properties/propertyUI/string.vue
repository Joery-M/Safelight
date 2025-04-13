<template>
    <InputText
        v-if="!prop.meta?.textArea"
        :model-value="prop.displayValue ? prop.displayValue() : prop.value()"
        @value-change="prop.setValue($event ?? '')"
    />
    <Textarea
        v-else
        :model-value="prop.displayValue ? prop.displayValue() : prop.value()"
        @value-change="prop.setValue($event)"
    />
</template>

<script setup lang="ts">
import type { SLEffectProperty } from '@safelight/shared/Effects/transformEffect';
import { InputText, Textarea } from 'primevue';
import { defineProps } from 'vue';

defineProps<{ prop: SLEffectProperty<string> }>();
</script>
