<template>
    <DataView :value="modelValue" :data-key="dataKey"> </DataView>
</template>

<script setup lang="ts">
import DataView from 'primevue/dataview';

defineModel<object[]>({ default: [] });
defineProps<{
    dataKey: string;
}>();
</script>
