<!-- eslint-disable vue/no-v-model-argument -->
<template>
    <div
        ref="monacoContainer"
        :style="{
            width: width + 'px',
            height: height + 'px'
        }"
    ></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import OneMonokai from './themes/OneMonokai-Monaco.json';
import type { editor } from 'monaco-editor';

const vModel = defineModel<string>({
    default: '',
    required: false
});
const monacoContainer = ref<HTMLDivElement>();

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
self.MonacoEnvironment = {
    async getWorker(_, label) {
        switch (label) {
            case 'json':
                return new (
                    await import('monaco-editor/esm/vs/language/json/json.worker?worker')
                ).default();
            case 'css':
            case 'scss':
            case 'less':
                return new (
                    await import('monaco-editor/esm/vs/language/css/css.worker?worker')
                ).default();
            case 'html':
            case 'handlebars':
            case 'razor':
                return new (
                    await import('monaco-editor/esm/vs/language/html/html.worker?worker')
                ).default();
            case 'javascript':
            case 'typescript':
                return new (
                    await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')
                ).default();
            default:
                return new (
                    await import('monaco-editor/esm/vs/editor/editor.worker?worker')
                ).default();
        }
    }
};

const currentEditor = shallowRef<editor.IStandaloneCodeEditor>();

onMounted(() => {
    if (!monacoContainer.value) return;
    if (currentEditor.value) currentEditor.value.dispose();

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `
        declare class test {
            hi: string
        }
    `
    );

    monaco.editor.defineTheme('darkplus', OneMonokai as unknown as editor.IStandaloneThemeData);

    currentEditor.value = monaco.editor.create(monacoContainer.value, {
        value: vModel.value,
        language: 'typescript',
        automaticLayout: true,
        theme: 'darkplus',
        'semanticHighlighting.enabled': true
    });

    currentEditor.value.onDidChangeModelContent(() => {
        const value = currentEditor.value!.getValue();
        if (value !== vModel.value) {
            vModel.value = value;
        }
    });
});

watch(vModel, (newValue) => {
    if (currentEditor.value && currentEditor.value.getValue() !== newValue) {
        currentEditor.value.setValue(newValue!);
    }
});

onBeforeUnmount(() => {
    currentEditor.value?.dispose();
});
</script>
