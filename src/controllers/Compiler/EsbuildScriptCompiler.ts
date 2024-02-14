import * as esbuild from 'esbuild-wasm';
import esbuildWasmUrl from 'esbuild-wasm/esbuild.wasm?url';
import Path from 'path-browserify';

// https://github.com/evanw/esbuild/issues/1952#issuecomment-1020006960
function customResolver(tree: Record<string, string>): esbuild.Plugin {
    const map = new Map(Object.entries(tree));

    return {
        name: 'inmemory-plugin-file-resolver',

        setup: (build: esbuild.PluginBuild) => {
            build.onResolve({ filter: /.*/ }, (args: esbuild.OnResolveArgs) => {
                if (args.kind === 'entry-point') {
                    return { path: '/' + args.path };
                }

                if (args.kind === 'import-statement') {
                    const dirname = Path.dirname(args.importer);

                    const path = Path.join(dirname, args.path);

                    return { path };
                }

                throw Error('not resolvable');
            });

            build.onLoad({ filter: /.*/ }, (args: esbuild.OnLoadArgs) => {
                if (!map.has(args.path) && !map.has(args.path + '.ts')) {
                    throw Error('Could not load ' + args.path);
                }
                const ext = Path.extname(args.path) ?? '.ts';

                const contents = map.get(args.path)!;

                const loader =
                    ext === '.ts'
                        ? 'ts'
                        : ext === '.tsx'
                          ? 'tsx'
                          : ext === '.js'
                            ? 'js'
                            : ext === '.jsx'
                              ? 'jsx'
                              : 'default';

                return { contents, loader };
            });
        }
    };
}

const esBuildOptions: esbuild.BuildOptions = {
    target: ['es6'],
    jsx: 'automatic',
    minifyIdentifiers: true,
    sourcemap: true
};
// const esbuildTransformOptions: esbuild.TransformOptions = {
//     target: ['es6'],
//     loader: 'ts',
//     jsx: 'automatic',
//     minifyIdentifiers: true,
//     sourcemap: true
// };

export default class EsBuildScriptCompiler {
    private esbuildReady: Promise<void>;

    constructor() {
        esbuild.stop();
        this.esbuildReady = esbuild.initialize({
            wasmURL: esbuildWasmUrl
        });
    }

    async compile(source: { title: string; content: string }[]) {
        await this.esbuildReady;

        const tree: { [key: string]: string } = {};

        source.forEach((file) => {
            tree['/' + file.title] = file.content;
        });

        return await esbuild.build({
            ...esBuildOptions,
            entryPoints: ['index.ts'],
            bundle: false,
            write: false,
            plugins: [customResolver(tree)]
        });
    }
}
