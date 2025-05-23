import { OnLoadArgs, OnResolveArgs, Plugin, PluginBuild } from 'esbuild-wasm';
import { dirname, extname, join } from 'pathe';
import shim from './shim/darkroom-shim?raw';

const internalPaths = new Map<string, string>([['/@darkroom-internal/darkroom-shim.ts', shim]]);

const jsDelivrNpm =
    /^https:\/\/cdn\.jsdelivr\.net\/(npm|gh)\/@?[a-z0-9-.]+(@(latest|v?(?:0|[1-9][0-9]*\.?)+(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?))?(\/[\da-z-.]+)\/?/g;
const esmRun =
    /^https:\/\/(www\.)?esm\.run\/@?[a-z0-9-.]+(@(latest|v?(?:0|[1-9][0-9]*\.?)+(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?))?(\/[\da-z-.]+)\/?/g;
const unpkgNpm =
    /^https:\/\/(www\.)?unpkg\.com\/@?[a-z0-9-.]+(@(latest|v?(?:0|[1-9][0-9]*\.?)+(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?))?(\/[\da-z-.]+)\/?/g;

// https://github.com/evanw/esbuild/issues/1952#issuecomment-1020006960
export function customResolver(tree: Record<string, string>): Plugin {
    const map = new Map(Object.entries(tree));

    return {
        name: 'inmemory-plugin-file-resolver',

        setup: (build: PluginBuild) => {
            build.onResolve({ filter: /.*/ }, async (args: OnResolveArgs) => {
                if (args.kind === 'entry-point') {
                    return { path: '/' + args.path };
                }

                if (args.kind === 'import-statement' || args.kind === 'dynamic-import') {
                    if (
                        jsDelivrNpm.test(args.path) ||
                        esmRun.test(args.path) ||
                        unpkgNpm.test(args.path)
                    ) {
                        console.log(args.path);
                        // const request = await fetch(args.path);
                        // console.log(request.url);
                        // map.set('#darkroom-external://' + request.url, await request.text());
                        return {
                            path: args.path,
                            namespace: 'darkroom-external'
                        };
                    }

                    const dir = dirname(args.importer);

                    const path = join(dir, args.path);

                    return { path, external: false };
                }

                throw Error(
                    `Could not resolve module "${args.path}". Please check if the file is in the project or if the package is defined`
                );
            });

            build.onLoad({ filter: /.*/ }, (args: OnLoadArgs) => {
                // Idk what is happening, but if i remove this, an error occurs every second time i build
                // From what i can tell, this is not used what so ever
                if (
                    /\/?#darkroom-external/.test(args.path) ||
                    jsDelivrNpm.test(args.path) ||
                    esmRun.test(args.path) ||
                    unpkgNpm.test(args.path)
                ) {
                    return {
                        contents: map.get(args.path),
                        loader: 'js'
                    };
                }
                if (args.path.startsWith('/@darkroom-internal/')) {
                    if (internalPaths.has(args.path)) {
                        return {
                            contents: internalPaths.get(args.path),
                            loader: 'ts'
                        };
                    }
                }
                if (!map.has(args.path) && !map.has(args.path + '.ts')) {
                    throw Error('Could not load ' + args.path);
                }
                const ext = extname(args.path) ?? '.ts';

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
