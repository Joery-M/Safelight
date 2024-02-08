import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import mkcert from 'vite-plugin-mkcert';
import UnoCSS from 'unocss/vite';
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide';
import presetAutoprefixer from 'unocss-preset-autoprefixer';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';
import { presetDaisy } from 'unocss-preset-daisy';
import { transformerDirectives } from 'unocss';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        Components({ dirs: ['src/components', 'src/@core'] }),
        AutoImport({
            imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/math', 'pinia'],
            dirs: ['./src/stores', './src/controllers/**'],
            vueTemplate: true,
            ignore: ['useCookies', 'useStorage']
        }),
        UnoCSS({
            presets: [
                presetUno(),
                presetScrollbarHide(),
                presetAutoprefixer(),
                presetDaisy({
                    themes: [
                        {
                            dark: {
                                primary: '#ffe200',
                                secondary: '#FFA400',
                                accent: '#4D39AA',
                                neutral: '#1a1a1a',
                                'base-100': '#212121',
                                info: '#82aaff',
                                success: '#c3e88d',
                                warning: '#f78c6c',
                                error: '#f07178'
                            }
                        }
                    ]
                }),
                presetIcons({
                    collections: {
                        phosphor: () => import('@iconify-json/ph/icons.json').then((i) => i.default)
                    }
                })
            ],
            theme: {
                brand: {
                    primary: '#ffe200',
                    secondary: '#FFA400',
                    accent: '#4D39AA',
                    neutral: '#1a1a1a',
                    base: '#212121',
                    info: '#82aaff',
                    success: '#c3e88d',
                    warning: '#f78c6c',
                    error: '#f07178'
                }
            },
            transformers: [transformerDirectives()]
        }),
        mkcert()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
