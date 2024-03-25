import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test } from 'vitest';
import { Compiler } from '..';

test('Simple build 1', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.waitForReady();

    const result = await compiler.compileSingleScript(`
        export const test = "A" + "s" + 'df' + "g"
    `);

    // Notice the lack of the concationation
    expect(result.outputFiles[0].text).toContain('Asdfg');
});
