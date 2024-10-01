<template>
    <h2>Darkroom</h2>
    <p>esbuild ready: {{ isReady }}</p>
    <button v-for="(content, file) in source" :key="file" @click="activeFile = file.toString()">
        {{ file }}
    </button>
    <p>Type a new file name here, then start typing in the code editor (IK, scuffed)</p>
    <input v-model="activeFile" type="text" />
    <codemirror
        v-model="source[activeFile]"
        placeholder="Code goes here..."
        :style="{ height: '300px' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="4"
        :extensions="[javascript()]"
    />
    <button @click="compile()">Compile</button>
    <button @click="execute()">Execute</button>
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
import { javascript } from '@codemirror/lang-javascript';
import {
    onKeyPressed,
    useDebounce,
    useKeyModifier,
    useLocalStorage,
    watchDebounced
} from '@vueuse/core';
import { useObservable } from '@vueuse/rxjs';
import { type BuildResult } from 'esbuild-wasm';
import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { lastValueFrom, Observable } from 'rxjs';
import util from 'util';
import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { Compiler, Script } from '../../';

const compiler = new Compiler(esbuild);

const isReady = useObservable(compiler.esbuildReady);
const source = useLocalStorage<{ [filename: string]: string }>('darkroom-dev-sourcecode', {
    '/index.ts': ''
});
const activeFile = ref('/index.ts');
const output = ref('');
const log = ref('');

const debouncedRef = useDebounce(source, 2000);
watchDebounced(
    debouncedRef,
    () => {
        console.log('Compile');
        compile();
    },
    {
        debounce: 500,
        deep: true
    }
);

const ctrl = useKeyModifier('Control');
onKeyPressed('Enter', () => {
    if (ctrl.value) {
        execute();
    }
});

let compiledScript: BuildResult | null = null;

const timeStart = ref(0);
const timeEnd = ref(0);

async function compile() {
    await lastValueFrom(
        new Observable((sub) => {
            compiler.esbuildReady.subscribe((isReady) => {
                if (isReady) {
                    sub.next(isReady);
                    sub.complete();
                }
            });
        })
    );
    timeStart.value = Date.now();
    const result = await compiler.compileScripts(source.value);
    timeEnd.value = Date.now() - timeStart.value;
    output.value = result.outputFiles[0].text;
    compiledScript = result;
}

async function execute() {
    log.value = '';
    if (!compiledScript || !compiledScript.metafile) {
        return;
    }
    const scr = new Script(output.value);

    // Console.time shim
    const timeLabels: { [label: string]: number } = {};

    scr.defineGlobals({
        console: {
            log(...args) {
                log.value += util.format(...args);
            },
            time(label: string) {
                timeLabels[label] = Date.now();
            },
            timeEnd(label: string) {
                const time = Date.now() - timeLabels[label];
                log.value += '\n' + util.format(`${label}: ${time}ms`);
            }
        } as Console,
        setTimeout(callback: () => any, ms: number) {
            setTimeout(callback, ms + Math.random() * 2 - 1);
        }
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
#app > div > div > .cm-editor {
    flex-grow: 1;
    max-width: 50%;
}
</style>
