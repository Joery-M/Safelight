import terser from '@rollup/plugin-terser';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig((config) => {
    return {
        // only use the dts plugin in dev mode, since pnpm doesn't wait for it to finish when building.
        // Use tsc instead.
        plugins: [
            config.mode == 'development'
                ? dts({ tsconfigPath: resolve(import.meta.dirname, './tsconfig.lib.json') })
                : terser({
                      compress: true,
                      mangle: true,
                      format: {
                          preserve_annotations: true
                      }
                  })
        ],
        build: {
            lib: {
                formats: config.mode == 'development' ? ['es'] : ['es', 'cjs'],
                entry: resolve(import.meta.dirname, 'src/index.ts'),
                fileName(format, entryName) {
                    return entryName + (format == 'es' ? '.js' : '.cjs');
                }
            },
            sourcemap: config.mode == 'development' ? true : 'hidden',
            minify: false,
            rollupOptions: {
                output: {
                    manualChunks: (id) => {
                        if (id.endsWith('elements.ts')) return 'elements';
                    }
                }
            }
        }
    };
});
