import esbuild from 'esbuild-wasm';
import 'ses';
import { customResolver } from './moduleResolver';

export class Compiler {
    esbuildReady: Promise<void> | undefined;

    private esBuildOptions: esbuild.BuildOptions = {
        target: ['esnext'],
        format: 'esm',
        jsx: 'automatic',
        bundle: true,
        minifyIdentifiers: true,
        sourcemap: true
    };

    constructor(esbuildWasmUrl: string) {
        esbuild.stop();

        this.esbuildReady = esbuild.initialize({
            wasmURL: esbuildWasmUrl
        });
    }

    async compileSingleScript(script: string) {
        const compilation = await esbuild.build({
            ...this.esBuildOptions,
            entryPoints: ['index.ts'],
            write: false,
            inject: ['@darkroom-internal/darkroom-shim.ts'],
            plugins: [
                customResolver({
                    '/index.ts': script
                })
            ]
        });

        return compilation.outputFiles[0].text;
    }
}

export * from './script';
