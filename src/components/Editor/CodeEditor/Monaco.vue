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
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import OneMonokai from './themes/OneMonokai-Monaco.json';

// monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//     lib: ['ESNext', 'Decorators', 'ES2015'],
//     allowSyntheticDefaultImports: true
// });

monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `
    declare class test {
        hi: string
    }
    `
);

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
    getWorker(_, label) {
        switch (label) {
            case 'json':
                return new jsonWorker();
            case 'css':
            case 'scss':
            case 'less':
                return new cssWorker();
            case 'html':
            case 'handlebars':
            case 'razor':
                return new htmlWorker();
            case 'javascript':
            case 'typescript':
                return new tsWorker();
            default:
                return new editorWorker();
        }
    }
};

const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>();

onMounted(() => {
    if (!monacoContainer.value) return;
    if (editor.value) editor.value.dispose();

    monaco.editor.defineTheme(
        'darkplus',
        OneMonokai as unknown as monaco.editor.IStandaloneThemeData
    );

    editor.value = monaco.editor.create(monacoContainer.value, {
        value: vModel.value,
        language: 'typescript',
        automaticLayout: true,
        theme: 'darkplus',
        'semanticHighlighting.enabled': true
    });

    editor.value.onDidChangeModelContent(() => {
        const value = editor.value!.getValue();
        if (value !== vModel.value) {
            vModel.value = value;
        }
    });
});

watch(vModel, (newValue) => {
    if (editor.value && editor.value.getValue() !== newValue) {
        editor.value.setValue(newValue!);
    }
});

onBeforeUnmount(() => {
    editor.value?.dispose();
});
</script>
