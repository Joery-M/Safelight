<template>
    <div ref="container" style="width: 800px; height: 600px; border: 1px solid grey"></div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
const vModel = defineModel({
    default: '',
    required: false,
    type: String,
    set(v) {
        if (dontUpdate.value) {
            return v;
        }
        const currEditor = monaco.editor.getEditors().find((e) => e.getId() == editor?.getId());

        dontUpdate.value = true;
        if (currEditor) currEditor.setValue(v);
        dontUpdate.value = false;
        return v;
    },
    get(v) {
        if (dontUpdate.value) {
            return v;
        }
        const currEditor = monaco.editor.getEditors().find((e) => e.getId() == editor?.getId());

        dontUpdate.value = true;
        if (currEditor) return currEditor.getValue();
        dontUpdate.value = false;
        return v;
    }
});

// const modelThrottled = useThrottle(vModel, 100);

const dontUpdate = ref(false);
const container = ref<HTMLDivElement>();
let editor: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
    if (!container.value) return;

    editor = monaco.editor.create(container.value, {
        value: vModel.value,
        lineNumbers: 'on',
        theme: 'vs-dark'
    });

    editor.onDidChangeModelContent((e) => {
        if (dontUpdate.value) {
            return;
        }
        const currEditor = monaco.editor.getEditors().find((e) => e.getId() == editor.getId());

        dontUpdate.value = true;
        if (currEditor) vModel.value = currEditor.getValue();
        dontUpdate.value = false;
    });
});

defineProps<{
    width?: number | string;
    height?: number | string;
}>();
</script>
