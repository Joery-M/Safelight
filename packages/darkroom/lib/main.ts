import esbuild from 'esbuild-wasm';
import 'ses';
import { customResolver } from './moduleResolver';

export class Compiler {
    esbuildReady: Promise<void> | undefined;
    private esbuildWasm: string = '';

    private esBuildOptions: esbuild.BuildOptions = {
        target: ['es2020', 'chrome70', 'firefox70'],
        format: 'iife',
        jsx: 'automatic',
        bundle: true,
        minifyIdentifiers: true,
        sourcemap: true
    };

    constructor(esbuildWasmUrl: string) {
        fetch(esbuildWasmUrl)
            .then((res) => res.blob())
            .then(async (blob) => {
                if (!this.esbuildWasm.includes('blob'))
                    this.esbuildWasm = URL.createObjectURL(blob);

                await esbuild.stop();

                this.esbuildReady = esbuild.initialize({
                    wasmURL: esbuildWasmUrl
                });
            });
    }

    async restartEsbuild() {
        await esbuild.stop();
        await esbuild.initialize({
            wasmURL: this.esbuildWasm
        });
    }

    async compileSingleScript(script: string) {
        const moduleResolveRegex = /(?<=from "|')(#package\/|https:\/\/)([A-z0-9./@]*)(?="|')/g;

        const modules: string[] = [];
        let match: RegExpExecArray;
        while ((match = moduleResolveRegex.exec(script)!) != null) {
            modules.push(match[0], '/' + match[0]);
        }

        const compilation = await esbuild.build({
            ...this.esBuildOptions,
            entryPoints: ['index.ts'],
            write: false,
            inject: ['@darkroom-internal/darkroom-shim.ts'],
            external: modules,
            plugins: [
                customResolver({
                    '/index.ts': script
                })
            ],
            metafile: true
        });

        this.restartEsbuild();
        return compilation;
    }
}

export * from './script';
