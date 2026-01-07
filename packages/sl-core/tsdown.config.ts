import path from 'node:path';
import { defineConfig } from 'tsdown';

// Vite isn't the correct import to use, but the type matches well enough for now
import type { Plugin } from 'vite';

const bindingFile = path.resolve('src/binding.js');
const bindingFileWasi = 'src/sl-core-binding.wasi.cjs';
const bindingFileWasiBrowser = 'src/sl-core-binding.wasi-browser.js';
const workerFile = 'src/wasi-worker.mjs';
const workerFileBrowser = 'src/wasi-worker-browser.mjs';
const wasmFile = 'src/sl-core-binding.wasm32-wasi*.wasm';
const wasmFileBrowser = 'src/sl-core-binding.wasm32-wasi.wasm';

function resolveWasiBinding(wasiBindingFile: string): Plugin {
    return {
        name: 'resolve-wasi-binding',
        resolveId: {
            filter: { id: /\bbinding\b/ },
            async handler(id, importer, options) {
                const resolution = await this.resolve(id, importer, options);

                if (resolution?.id === bindingFile) {
                    return { id: path.resolve(wasiBindingFile), external: 'relative' };
                }

                return resolution;
            }
        }
    };
}

export default defineConfig((opts) => {
    const BROWSER = opts.platform === 'browser';
    return {
        entry: [
            './src/index.ts',
            BROWSER ? workerFileBrowser : workerFile,
            BROWSER ? bindingFileWasiBrowser : bindingFileWasi
        ],
        plugins: [resolveWasiBinding(BROWSER ? bindingFileWasiBrowser : bindingFileWasi)],
        copy: [
            {
                from: BROWSER ? wasmFileBrowser : wasmFile,
                to: './dist/'
            }
        ],
        external: ['@napi-rs/wasm-runtime'],
        dts: true,
        exports: false,
        minify: {
            codegen: { removeWhitespace: false },
            mangle: false
        },
        platform: BROWSER ? 'browser' : 'node',
        shims: true,
        sourcemap: true,
        target: 'es2020',
        inputOptions: {
            resolve: {
                extensions: ['.js', '.cjs', '.mjs', '.ts']
            }
        },
        outputOptions: {
            format: 'esm',
            entryFileNames: '[name].js'
        }
    };
});
