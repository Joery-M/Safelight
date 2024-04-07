import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test, vi } from 'vitest';
import { Compiler, Script } from '..';

test('External function', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.waitForReady();

    const hitMe = vi.fn();

    const result = await compiler.compileSingleScript(`
        hitMe("Ok")
        hitMe("Sure")
    `);

    const script = new Script(result);

    script.defineGlobals({
        hitMe
    });

    script.execute();

    expect(hitMe).toBeCalledWith('Ok');
    expect(hitMe).toBeCalledWith('Sure');
});

test('External function with object', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.waitForReady();

    const hitMe = vi.fn();

    const result = await compiler.compileSingleScript(`
        hitMe({1: 'A'})
        hitMe({2: 'B'})
    `);

    const script = new Script(result);

    script.defineGlobals({
        hitMe
    });

    script.execute();

    expect(hitMe).toBeCalledWith({ 1: 'A' });
    expect(hitMe).toBeCalledWith({ 2: 'B' });
});
