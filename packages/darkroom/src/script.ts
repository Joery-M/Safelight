import { BuildResult } from 'esbuild-wasm';

export class Script {
    private compartment: Compartment | undefined;
    private globals: any;
    private content: string;

    constructor(content: string | BuildResult) {
        if (typeof content === 'string') {
            this.content = content;
        } else if (content.outputFiles && content.outputFiles.length > 0) {
            this.content = content.outputFiles[0].text;
        } else {
            this.content = 'throw new Error("File content was not provided to Script class.")';
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerModule(name: string, content: string): void {
        throw new Error('Method not implemented');
    }

    execute(): any {
        this.compartment = new Compartment(this.globals);

        return this.compartment.evaluate(this.content);
    }

    defineGlobals(globals: any): void {
        this.globals = globals;
    }
}
