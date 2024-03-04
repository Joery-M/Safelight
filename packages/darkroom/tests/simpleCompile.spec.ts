import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import Darkroom from '..';

test('Simple build 1', async () => {
    const dr = new Darkroom(esbuild);

    expect(dr).toBeDefined();

    await dr.esbuildReady;

    const result = await dr.compileSingleScript(`
        export const test = "A" + "s" + 'df' + "g"
    `);

    // Notice the lack of the concationation
    expect(result).toContain('Asdfg');
});
