import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig((config) => {
    return {
        // only use the dts plugin in dev mode,
        // since pnpm doesn't wait for it to finish when
        // running 'build' in workspace root.
        // Use tsc instead.
        plugins: [config.mode == 'development' ? dts() : undefined],
        build: {
            lib: {
                formats: ['es', 'cjs'],
                entry: resolve(__dirname, 'src/JsWebm.ts'),
                name: 'jswebm'
            },
            sourcemap: config.mode == 'development'
        }
    };
});
