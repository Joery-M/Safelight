import { ModuleExportsNamespace } from 'ses';

export class Script {
    private compartment: Compartment | undefined;
    private globals: any;
    public requestedModules: string[] = [];
    modules = new Map<string, string>();

    constructor(private content: string) {
        const moduleResolveRegex = /("|')#darkroom-external:\/\/([A-z0-9./:@]*)("|')/g;

        let match: RegExpExecArray;
        while ((match = moduleResolveRegex.exec(content)!) != null) {
            this.requestedModules.push(match[2]);
        }
    }

    registerModule(name: string, content: string) {
        console.log(name);
        this.modules.set('#darkroom-external:' + name, content);
    }

    execute() {
        this.compartment = new Compartment(this.globals);

        return this.compartment.evaluate(this.content);
    }

    defineGlobals(globals: any) {
        this.globals = globals;
    }
}
