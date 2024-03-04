import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import Darkroom from '..';

test('esbuild initializes', async () => {
    const dr = new Darkroom(esbuild);

    expect(dr).toBeDefined();

    await dr.esbuildReady;
});
