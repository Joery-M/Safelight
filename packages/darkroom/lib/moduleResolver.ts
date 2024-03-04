import { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild } from 'esbuild-wasm';
import Path from 'path-browserify';

// https://github.com/evanw/esbuild/issues/1952#issuecomment-1020006960
function customResolver(tree: Record<string, string>): Plugin {
    const map = new Map(Object.entries(tree));

    return {
        name: 'inmemory-plugin-file-resolver',

        setup: (build: PluginBuild) => {
            build.onResolve({ filter: /.*/ }, (args: OnResolveArgs) => {
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

            build.onLoad({ filter: /.*/ }, (args: OnLoadArgs) => {
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
