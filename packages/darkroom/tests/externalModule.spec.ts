import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import { Compiler, Script } from '..';

test('External module resolution', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.esbuildReady;

    const result = await compiler.compileSingleScript(`
        import _ from "https://cdn.jsdelivr.net/npm/lodash@4.17.21"
        import cleave from "https://unpkg.com/cleave.js@latest"
        export const a = _.join([1, 2, 3], 2)
        export const b = new cleave.Cleave()
        export const test = "A" + "s" + 'df' + "g"
    `);

    const script = new Script(result);

    expect(script.requestedModules).toHaveLength(2);
});

test('External module importing', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.esbuildReady;

    const result = await compiler.compileSingleScript(`
        import _ from "https://cdn.jsdelivr.net/npm/lodash@4.17.21"
        import cleave from "https://unpkg.com/cleave.js@latest"
        export const a = _.join([1, 2, 3], 2)
        export const b = new cleave.Cleave()
        export const test = "A" + "s" + 'df' + "g"
    `);

    const script = new Script(result);

    expect(script.requestedModules).toHaveLength(2);
});
