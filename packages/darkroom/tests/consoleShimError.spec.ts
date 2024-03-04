import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import Darkroom from '..';

test('Console Shim Error', async () => {
    const dr = new Darkroom(esbuild);

    expect(dr).toBeDefined();

    await dr.esbuildReady;

    const result = await dr.compileSingleScript(`
    console.log('Hey!');
    `);

    // Console is not a global we (currently) allow, so the code should throw an error
    expect(() => dr.executeScript(result)).toThrow();
});
