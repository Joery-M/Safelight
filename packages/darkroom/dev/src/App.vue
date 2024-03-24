<template>
    <h2>Darkroom</h2>
    <p>esbuild ready: {{ isReady }}</p>
    <codemirror
        v-model="source"
        placeholder="Code goes here..."
        :style="{ height: '300px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="4"
        :extensions="[javascript()]"
    />
    <div>
        <template v-for="mod in allowedModules">
            {{ mod }}
        </template>
    </div>
    <button @click="compile">Compile</button>
    <button @click="execute">Execute</button>
    <p>Compilation time: {{ timeEnd }}ms</p>
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
import { reactive, ref } from 'vue';
import { Compiler, Script } from '../../';
import { useLocalStorage } from '@vueuse/core';
import util from 'util';
import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { type BuildResult } from 'esbuild-wasm';

const compiler = new Compiler(esbuild);

const isReady = ref(false);
const source = useLocalStorage('darkroom-dev-sourcecode', '');
const output = ref('');
const log = ref('');
const allowedModules = reactive(new Map<string, boolean>());
let compiledScript: BuildResult | null = null;

compiler.esbuildReady?.then(() => {
    console.log('esbuild ready');
    isReady.value = true;
});

const timeStart = ref(0);
const timeEnd = ref(0);

async function compile() {
    timeStart.value = Date.now();
    const result = await compiler.compileSingleScript(source.value);
    output.value = result.outputFiles[0].text;
    compiledScript = result;
    timeEnd.value = Date.now() - timeStart.value;
    for (const url in result.metafile.inputs) {
        allowedModules.set(url, true);
    }
}

async function execute() {
    log.value = '';
    if (!compiledScript || !compiledScript.metafile) {
        return;
    }
    const scr = new Script(output.value, compiledScript.metafile.inputs);

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

    try {
        scr.execute();
    } catch (error) {
        console.log(error);
        log.value += util.format(error);
    }
}
</script>

<style>
.cm-editor {
    flex-grow: 1;
    max-width: 50%;
}
</style>
