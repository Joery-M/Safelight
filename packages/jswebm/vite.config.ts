import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import noBundlePlugin from 'vite-plugin-no-bundle';

export default defineConfig((config) => {
    return {
        // only use the dts plugin in dev mode,
        // since pnpm doesn't wait for it to finish when
        // running 'build' in workspace root.
        // Use tsc instead.
        plugins: [
            config.mode == 'development'
                ? dts({ tsconfigPath: resolve(import.meta.dirname, './tsconfig.lib.json') })
                : undefined,
            noBundlePlugin()
        ],
        build: {
            lib: {
                formats: config.mode == 'development' ? ['es'] : ['es', 'cjs'],
                entry: resolve(import.meta.dirname, 'src/JsWebm.ts'),
                name: 'jswebm'
            },
            sourcemap: config.mode == 'development'
        }
    };
});
