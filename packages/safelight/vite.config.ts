import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig } from 'vite';
import HotGlob from 'vite-plugin-hot-glob';
import mkcert from 'vite-plugin-mkcert';
import generateI18n from './buildscripts/vite-plugin-generate-i18n';
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __TEST__: false
    },
    plugins: [
        UnoCSS(),
        vue(),
        mkcert(),
        generateI18n({
            localesDir: path.join(import.meta.dirname, '../shared/src/Localization/i18n/'),
            outputFile: path.join(import.meta.dirname, './types/i18n.d.ts')
        }),
        HotGlob()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    optimizeDeps: {
        entries: ['./src/**/*.{vue,ts}', '../shared/src/**/*.ts']
    },
    server: {
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin'
        }
    },
    css: {
        devSourcemap: true
    }
});
