import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import { Compiler } from '..';

test('esbuild initializes', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();
    await compiler.waitForReady();

    compiler.esbuildReady.subscribe((ready) => expect(ready).toBe(true));
});
