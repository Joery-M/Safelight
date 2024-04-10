import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import TurboConsole from 'unplugin-turbo-console/vite';
import { ComponentResolverObject } from 'unplugin-vue-components';
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

const PhosphorResolver: ComponentResolverObject = {
    type: 'component',
    async resolve(name) {
        if (name.startsWith('Ph')) {
            return resolve(
                __dirname,
                `./node_modules/@phosphor-icons/vue/dist/icons/${name}.vue.mjs`
            ).replace(/\\/g, '/');
        }
    }
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        VueRouter({
            routesFolder: {
                src: path.join(__dirname, './src/views')
            }
        }),
        vue(),
        Components({
            dirs: ['src/components', 'src/@core'],
            resolvers: [PrimeVueResolver({ importIcons: false }), PhosphorResolver]
        }),
        AutoImport({
            imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
            dirs: ['./src/stores', './src/controllers/**'],
            vueTemplate: true
        }),
        TurboConsole(),
        mkcert(),
        visualizer()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin'
        }
    }
});
