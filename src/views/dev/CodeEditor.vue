<template>
    <!-- eslint-disable vue/no-v-model-argument -->
    <div>
        <button
            @click="
                tabs.push({
                    title: uuidv4() + '.ts',
                    content: ''
                })
            "
        >
            +
        </button>
    </div>

    <br />

    <div v-for="(tab, index) in tabs" :key="index">
        <input v-model="tab.title" type="text" />
        <Monaco v-model="tab.content"></Monaco>
    </div>

    <br />

    <div>
        <button @click="compile">Compile</button> <br />
        <Monaco v-model="result"></Monaco>
    </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const tabs = ref<{ title: string; content: string }[]>([
    {
        title: 'index.ts',
        content: 'console.log("hi")'
    }
]);

const result = ref('');

const compiler = new EsbuildScriptCompiler();

async function compile() {
    try {
        result.value = (await compiler.compile(tabs.value)).outputFiles[0].text;
    } catch (error) {
        result.value = error as string;
    }
}
</script>
