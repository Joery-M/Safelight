import { defineConfig, transformerDirectives } from 'unocss';
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide';
import presetAutoprefixer from 'unocss-preset-autoprefixer';
import presetIcons from '@unocss/preset-icons';
import presetUno from '@unocss/preset-uno';

export default defineConfig({
    presets: [
        presetUno(),
        presetScrollbarHide(),
        presetAutoprefixer(),
        presetIcons({
            collections: {
                phosphor: () => import('@iconify-json/ph/icons.json').then((i) => i.default)
            }
        })
    ],
    theme: {
        colors: {
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
});
