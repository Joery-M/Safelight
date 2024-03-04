import esbuild from 'esbuild-wasm';

export default class Darkroom {
    esbuildReady: Promise<void>;

    constructor(esbuildWasmUrl: string) {
        esbuild.stop();

        this.initialize(esbuildWasmUrl);
    }

    private async initialize(wasmURL: string) {
        this.esbuildReady = esbuild.initialize({
            wasmURL
        });
    }
}
