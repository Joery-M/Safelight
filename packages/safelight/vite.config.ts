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

const vueuseRxjsAutoImport = {
    from: '@vueuse/rxjs',
    imports: [
        'OnCleanup',
        'UseExtractedObservableOptions',
        'UseObservableOptions',
        'UseSubjectOptions',
        'WatchExtractedObservableCallback',
        'WatchExtractedObservableOptions',
        'from',
        'fromEvent',
        'toObserver',
        'useExtractedObservable',
        'useObservable',
        'useSubject',
        'useSubscription',
        'watchExtractedObservable'
    ]
};

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
        Components({
            dirs: ['src/components', 'src/@core'],
            resolvers: [PrimeVueResolver({ importIcons: false }), PhosphorResolver]
        }),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                '@vueuse/core',
                '@vueuse/math',
                'pinia',
                vueuseRxjsAutoImport
            ],
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
