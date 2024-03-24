import { Metafile } from 'esbuild-wasm';

export class Script {
    private compartment: Compartment | undefined;
    private globals: any;
    public requestedModules: string[] = [];
    modules = new Map<string, string>();

    constructor(
        private content: string,
        inputs: Metafile['inputs']
    ) {
        for (const key in inputs) {
            if (key.startsWith('#darkroom-external:/')) {
                this.requestedModules.push(key.slice(20));
            }
        }
    }

    registerModule(name: string, content: string) {
        console.log(name);
        this.modules.set('#darkroom-external://' + name, content);
    }

    execute() {
        console.log(this.modules);
        this.compartment = new Compartment(
            this.globals,
            Object.fromEntries(this.modules.entries())
        );

        return this.compartment.evaluate(this.content);
    }

    defineGlobals(globals: any) {
        this.globals = globals;
    }
}
