import { defineConfig, presetIcons, presetWind3, transformerDirectives } from 'unocss';
import { presetPrime } from './buildscripts/unocss-preset-primeui';

export default defineConfig({
    outputToCssLayers: true,
    transformers: [transformerDirectives()],
    content: {
        pipeline: {
            include: [
                // Default
                /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
                // For panel icons
                '**/stores/useEditor.ts'
            ]
        }
    },
    presets: [presetWind3(), presetPrime(), presetIcons({ scale: 18, unit: 'px' })]
});
