<template>
    <Button to="/dev/">
        <template #icon>
            <PhArrowLeft />
        </template>
    </Button>
    <div>
        <Button
            @click="
                tabs.push({
                    title: uuidv4() + '.ts',
                    content: ''
                })
            "
        >
            <template #icon>
                <PhPlus />
            </template>
        </Button>
    </div>

    <br />

    <div v-for="(tab, index) in tabs" :key="index">
        <input v-model="tab.title" type="text" />
        <Button v-if="index > 0" @click="tabs.splice(index, 1)">
            <template #icon>
                <PhTrash />
            </template>
        </Button>
        <Lazy>
            <Monaco v-if="showEditors" v-model="tab.content" height="300"></Monaco>
        </Lazy>
        <br />
    </div>

    <div>
        <Button @click="compile">
            <template #icon>
                <PhWall></PhWall>
            </template>
            Compile
        </Button>
        <Lazy>
            <Monaco v-if="showEditors" v-model="result"></Monaco>
        </Lazy>
    </div>
</template>

<script setup lang="ts">
import Monaco from '@/components/Editor/CodeEditor/Monaco.vue';
import Lazy from '@/components/Lazy.vue';
import { PhArrowLeft, PhPlus, PhTrash, PhWall } from '@phosphor-icons/vue';
import Button from 'primevue/button';
import { v4 as uuidv4 } from 'uuid';
import { onMounted, ref } from 'vue';

const showEditors = ref(false);

const tabs = ref<{ title: string; content: string }[]>([
    {
        title: 'index.ts',
        content: 'console.log("hi")'
    }
]);

const result = ref('');

// const compiler = new EsbuildScriptCompiler();

async function compile() {
    try {
        // result.value = (await compiler.compile(tabs.value)).outputFiles[0].text;
    } catch (error) {
        result.value = error as string;
    }
}

onMounted(() => {
    showEditors.value = true;
});
</script>
