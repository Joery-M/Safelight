import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), dts({ cleanVueFileName: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'SafelightTimeline'
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['vue'],
            output: [
                {
                    format: 'esm',
                    entryFileNames: `[name].mjs`,
                    inlineDynamicImports: false,
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'Vue'
                    }
                },
                {
                    format: 'commonjs',
                    entryFileNames: `[name].cjs`,
                    inlineDynamicImports: true,
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'Vue'
                    }
                }
            ]
        }
    }
});
