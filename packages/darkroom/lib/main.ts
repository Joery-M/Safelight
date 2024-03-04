import esbuild from 'esbuild-wasm';
import 'ses';
import { customResolver } from './moduleResolver';

export default class Darkroom {
    esbuildReady: Promise<void> | undefined;
    private globals: any;

    private esBuildOptions: esbuild.BuildOptions = {
        target: ['esnext'],
        jsx: 'automatic',
        minifyIdentifiers: true,
        sourcemap: true
    };

    constructor(esbuildWasmUrl: string) {
        esbuild.stop();

        this.esbuildReady = esbuild.initialize({
            wasmURL: esbuildWasmUrl
        });
    }

    defineGlobals(globals: any) {
        this.globals = globals;
    }

    async compileSingleScript(script: string) {
        const compilation = await esbuild.build({
            ...this.esBuildOptions,
            entryPoints: ['index.ts'],
            bundle: true,
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

    executeScript(script: string) {
        const comp = new Compartment(this.globals);

        return comp.evaluate(script);
    }
}
