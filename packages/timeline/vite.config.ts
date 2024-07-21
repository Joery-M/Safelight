import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    define: {
        __TEST__: false
    },
    build: {
        lib: {
            entry: resolve(import.meta.dirname, 'src/index.ts'),
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
                    },
                    intro: 'import "./style.css";'
                },
                {
                    format: 'commonjs',
                    entryFileNames: `[name].cjs`,
                    inlineDynamicImports: true,
                    // Provide global variables to use in the UMD build
                    // for externalized deps
                    globals: {
                        vue: 'Vue'
                    },
                    intro: 'import "./style.css";'
                }
            ]
        }
    }
});
