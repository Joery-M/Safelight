import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import TurboConsole from 'unplugin-turbo-console/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __TEST__: false
    },
    plugins: [
        VueRouter({
            routesFolder: {
                src: path.join(__dirname, './src/views')
            }
        }),
        vue(),
        TurboConsole(),
        mkcert(),
        visualizer()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        include: [
            '@phosphor-icons/vue',
            '@vueuse/gesture',
            '@vueuse/math',
            '@vueuse/rxjs',
            'dexie',
            'fuzzysearch',
            'hash-wasm',
            'luxon',
            'mediainfo.js',
            'mime-matcher',
            'primevue/button',
            'primevue/buttongroup',
            'primevue/card',
            'primevue/column',
            'primevue/confirmdialog',
            'primevue/datatable',
            'primevue/dataview',
            'primevue/dataviewlayoutoptions',
            'primevue/dropdown',
            'primevue/inplace',
            'primevue/inputgroup',
            'primevue/inputgroupaddon',
            'primevue/inputmask',
            'primevue/inputtext',
            'primevue/menu',
            'primevue/menubar',
            'primevue/overlaypanel',
            'primevue/skeleton',
            'primevue/slider',
            'primevue/splitbutton',
            'primevue/splitter',
            'primevue/splitterpanel',
            'primevue/tabmenu',
            'primevue/toolbar',
            'primevue/tree',
            'primevue/useconfirm',
            'primevue/usedialog',
            'rxjs',
            'uuid'
        ]
    },
    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin'
        }
    }
});
