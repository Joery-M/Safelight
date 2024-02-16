<!-- eslint-disable vue/no-v-model-argument -->
<template>
    <!-- <MonacoEditor
        v-model:value="vModel"
        :language="language"
        :theme="theme"
        :width="width"
        :height="height"
    /> -->
    <p>oops {{ vModel }}</p>
</template>

<script setup lang="ts">
// import MonacoEditor from 'monaco-editor-vue3';

const vModel = defineModel({
    default: '',
    required: false,
    type: String
});

withDefaults(
    defineProps<{
        language?: string;
        width?: number | string;
        height?: number | string;
        theme?: string;
    }>(),
    {
        language: 'typescript',
        height: 600,
        width: 800,
        theme: 'vs-dark'
    }
);
</script>
