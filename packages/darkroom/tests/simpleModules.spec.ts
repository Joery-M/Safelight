import esbuild from 'esbuild-wasm/esbuild.wasm?url';
import { expect, test, vi } from 'vitest';
import { Compiler, Script } from '..';

test('Module resolution', async () => {
    const compiler = new Compiler(esbuild);

    expect(compiler).toBeDefined();

    await compiler.waitForReady();

    const result = await compiler.compileScripts({
        '/index.ts': `
        import { join } from "./join.ts";
        const concatenated = join([1, 2, 3], ',');

        final(concatenated);
    `,
        // Copied from lodash - join
        '/join.ts': `
/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other \`lodash\` methods. */
var nativeJoin = arrayProto.join;

/**
 * Converts all elements in \`array\` into a string separated by \`separator\`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to convert.
 * @param {string} [separator=','] The element separator.
 * @returns {string} Returns the joined string.
 * @example
 *
 * _.join(['a', 'b', 'c'], '~');
 * // => 'a~b~c'
 */
export function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator);
}

`
    });

    const script = new Script(result.outputFiles[0].text);

    const scriptResultFn = vi.fn();
    script.defineGlobals({
        final: scriptResultFn
    });

    script.execute();

    expect(scriptResultFn).toBeCalledWith('1,2,3');
});
