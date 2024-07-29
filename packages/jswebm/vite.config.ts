import { resolve } from 'path';
import { minify } from 'terser';
import { defineConfig, Plugin } from 'vite';
import dts from 'vite-plugin-dts';

const plugin = (): Plugin => ({
    name: 'minify-bundle',
    async generateBundle(_, bundle) {
        for (const asset of Object.values(bundle)) {
            if (asset.type == 'chunk') {
                asset.code =
                    (
                        await minify(asset.code, {
                            compress: false,
                            module: asset.fileName.endsWith('.js'),
                            mangle: false,
                            format: { preserve_annotations: true }
                        })
                    ).code ?? asset.code;
            }
        }
    }
});

export default defineConfig((config) => {
    return {
        // only use the dts plugin in dev mode,
        // since pnpm doesn't wait for it to finish when
        // running 'build' in workspace root.
        // Use tsc instead.
        plugins: [
            config.mode == 'development'
                ? dts({ tsconfigPath: resolve(import.meta.dirname, './tsconfig.lib.json') })
                : plugin()
        ],
        build: {
            lib: {
                formats: config.mode == 'development' ? ['es'] : ['es', 'cjs'],
                entry: resolve(import.meta.dirname, 'src/JsWebm.ts'),
                name: 'jswebm'
            },
            sourcemap: config.mode == 'development',
            minify: false
        }
    };
});
