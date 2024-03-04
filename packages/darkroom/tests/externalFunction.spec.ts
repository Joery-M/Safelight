import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test, vi } from 'vitest';
import Darkroom from '..';

test('External function', async () => {
    const dr = new Darkroom(esbuild);

    expect(dr).toBeDefined();

    await dr.esbuildReady;

    const hitMe = vi.fn();

    dr.defineGlobals({
        hitMe
    });

    const result = await dr.compileSingleScript(`
        hitMe("Ok")
        hitMe("Sure")
    `);

    dr.executeScript(result);

    expect(hitMe).toBeCalledWith('Ok');
    expect(hitMe).toBeCalledWith('Sure');
});
