<template>
    <h2>Darkroom</h2>
    <p>esbuild ready: {{ isReady }}</p>
    <codemirror
        v-model="source"
        placeholder="Code goes here..."
        :style="{ height: '400px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="4"
        :extensions="[javascript()]"
    />
    <button @click="compile">Compile</button>
    <button @click="execute">Execute</button>
    <div style="display: flex; width: 100%">
        <codemirror
            v-model="output"
            placeholder="Compiled code goes here"
            :style="{ height: '400px' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="4"
            :extensions="[javascript()]"
        />
        <codemirror v-model="log" disabled />
    </div>
</template>

<script setup lang="ts">
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { ref } from 'vue';
import { Compiler, Script } from '../../';
import { useLocalStorage } from '@vueuse/core';
import '@types/node/util';
import util from 'util';
import esbuild from 'esbuild-wasm/esbuild.wasm?url';

const compiler = new Compiler(esbuild);

const isReady = ref(false);
const source = useLocalStorage('darkroom-dev-sourcecode', '');
const output = ref('');
const log = ref('');

compiler.esbuildReady?.then(() => {
    console.log('esbuild ready');
    isReady.value = true;
});

async function compile() {
    const result = await compiler.compileSingleScript(source.value);
    output.value = result;
}

async function execute() {
    log.value = '';
    const scr = new Script(output.value);

    log.value += 'Requested modules: ' + scr.requestedModules.join(', ') + '\n';

    const modulePromises = scr.requestedModules.map(async (m) => {
        const content = await (await fetch(m)).text();
        scr.registerModule(m, content);
    });

    await Promise.all(modulePromises);

    scr.defineGlobals({
        console: {
            log(...args) {
                log.value += util.format(...args);
            }
        } as Console
    });

    scr.execute();
}
</script>

<style>
.cm-editor {
    flex-grow: 1;
    max-width: 50%;
}
</style>
