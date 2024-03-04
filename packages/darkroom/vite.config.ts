import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    // only use the dts plugin in dev mode,
    // since pnpm doesn't wait for it to finish when
    // running 'build' in workspace root.
    // Use tsc instead.
    plugins: [process.env.npm_lifecycle_event == 'dev' ? dts() : undefined],
    build: {
        lib: {
            formats: ['es'],
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'darkroom'
        },
        sourcemap: true
    }
});
