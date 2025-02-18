import esbuild from 'esbuild-wasm';
import { BehaviorSubject } from 'rxjs';
import 'ses';
import { customResolver } from './moduleResolver';

export class Compiler {
    esbuildReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private esbuildWasm: string = '';

    private esBuildOptions: esbuild.BuildOptions = {
        target: ['es2020', 'chrome70', 'firefox70'],
        write: false,
        format: 'iife',
        jsx: 'automatic',
        bundle: true,
        minifyIdentifiers: true,
        sourcemap: true,

        tsconfigRaw: {
            compilerOptions: {
                experimentalDecorators: true
            }
        }
    };

    constructor(esbuildWasmUrl: string) {
        fetch(esbuildWasmUrl)
            .then((res) => res.blob())
            .then(async (blob) => {
                if (!this.esbuildWasm.includes('blob'))
                    this.esbuildWasm = URL.createObjectURL(blob);

                this.esbuildReady.next(false);
                await esbuild.stop();

                esbuild
                    .initialize({
                        wasmURL: esbuildWasmUrl
                    })
                    .then(() => {
                        this.esbuildReady.next(true);
                    });
            });
    }

    async restartEsbuild(): Promise<void> {
        this.esbuildReady.next(false);
        await esbuild.stop();
        await esbuild.initialize({
            wasmURL: this.esbuildWasm
        });
        this.esbuildReady.next(true);
    }

    waitForReady(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.esbuildReady.subscribe((ready) => {
                if (ready) {
                    resolve();
                }
            });
        });
    }

    async compileSingleScript(script: string): Promise<esbuild.BuildResult> {
        const compilation = await esbuild.build({
            ...this.esBuildOptions,
            entryPoints: ['index.ts'],
            write: false,
            inject: ['@darkroom-internal/darkroom-shim.ts'],
            plugins: [
                customResolver({
                    '/index.ts': script
                })
            ],
            metafile: true
        });

        return compilation;
    }

    async compileScripts(scripts: { [filename: string]: string }): Promise<esbuild.BuildResult> {
        const compilation = await esbuild.build({
            ...this.esBuildOptions,
            entryPoints: ['index.ts'],
            write: false,
            inject: ['@darkroom-internal/darkroom-shim.ts'],
            plugins: [customResolver(scripts)],
            metafile: true
        });

        return compilation;
    }
}

export * from './script';
