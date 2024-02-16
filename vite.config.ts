import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import mkcert from 'vite-plugin-mkcert';
import { visualizer } from 'rollup-plugin-visualizer';
import TurboConsole from 'unplugin-turbo-console/vite';
import VueRouter from 'unplugin-vue-router/vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter(),
        vue(),
        Components({ dirs: ['src/components', 'src/@core'] }),
        AutoImport({
            imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
            dirs: ['./src/stores', './src/controllers/**'],
            vueTemplate: true
        }),
        TurboConsole(),
        mkcert()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        rollupOptions: {
            plugins: [visualizer()],
            output: {
                manualChunks: { three: ['three', '@janvorisek/drie'] }
            }
        }
    }
});
