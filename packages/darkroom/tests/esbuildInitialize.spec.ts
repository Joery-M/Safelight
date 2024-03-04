import { test } from 'vitest';
import Darkroom from '..';

test('esbuild initializes', async () => {
    console.log(new URL('esbuild-wasm/esbuild.wasm', import.meta.url).href);
    const dr = new Darkroom(new URL('esbuild-wasm/esbuild.wasm', import.meta.url).href);
    await dr.esbuildReady;
}, {timeout: 10000});
