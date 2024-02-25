import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import TurboConsole from 'unplugin-turbo-console/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter({
            routesFolder: {
                src: path.join(__dirname, './src/views')
            }
        }),
        vue(),
        Components({ dirs: ['src/components', 'src/@core', '@phosphor-icons/vue'] }),
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
