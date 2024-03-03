<template>
    <SLButton to="/dev/">
        <PhArrowLeft />
    </SLButton>
    <div>
        <SLButton
            @click="
                tabs.push({
                    title: uuidv4() + '.ts',
                    content: ''
                })
            "
        >
            <PhPlus />
        </SLButton>
    </div>

    <br />

    <div v-for="(tab, index) in tabs" :key="index">
        <input v-model="tab.title" type="text" />
        <SLButton v-if="index > 0" @click="tabs.splice(index, 1)">
            <PhTrash />
        </SLButton>
        <Lazy>
            <Monaco v-if="showEditors" v-model="tab.content" height="300"></Monaco>
        </Lazy>
        <br />
    </div>

    <div>
        <SLButton @click="compile">
            <template #icon>
                <PhWall></PhWall>
            </template>
            Compile
        </SLButton>
        <Lazy>
            <Monaco v-if="showEditors" v-model="result"></Monaco>
        </Lazy>
    </div>
</template>

<script setup lang="ts">
import { PhArrowLeft, PhPlus, PhTrash, PhWall } from '@phosphor-icons/vue';
import { v4 as uuidv4 } from 'uuid';

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
