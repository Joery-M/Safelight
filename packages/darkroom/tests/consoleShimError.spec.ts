import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import { Compiler, Script } from '..';

test('Console Shim Error', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.esbuildReady;

    const result = await compiler.compileSingleScript(`
        console.log('Hey!');
    `);

    // Console is not a global we (currently) allow, so the code should throw an error
    expect(new Script(result).execute).toThrow();
});
