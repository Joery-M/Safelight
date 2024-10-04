import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import generateI18n from './buildscripts/vite-plugin-generate-i18n';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __TEST__: false
    },
    plugins: [
        VueRouter({
            routesFolder: {
                src: path.join(import.meta.dirname, './src/views')
            }
        }),
        vue(),
        mkcert(),
        visualizer(),
        generateI18n({
            localesDir: path.join(import.meta.dirname, '../shared/src/Localization/i18n/'),
            outputFile: path.join(import.meta.dirname, './types/i18n.d.ts')
        })
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
            'primevue/checkbox',
            'primevue/column',
            'primevue/confirmdialog',
            'primevue/datatable',
            'primevue/dataview',
            'primevue/inplace',
            'primevue/inputgroup',
            'primevue/inputgroupaddon',
            'primevue/inputmask',
            'primevue/inputtext',
            'primevue/menu',
            'primevue/menubar',
            'primevue/overlaypanel',
            'primevue/popover',
            'primevue/select',
            'primevue/selectbutton',
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
            'uuid',
            'eventemitter3'
        ]
    },
    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin'
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern'
            }
        }
    }
});
