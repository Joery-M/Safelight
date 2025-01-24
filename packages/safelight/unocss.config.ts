import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss';
import { presetPrime } from './buildscripts/unocss-preset-primeui';

export default defineConfig({
    outputToCssLayers: true,
    transformers: [transformerDirectives()],
    presets: [presetUno(), presetAttributify(), presetPrime()]
});
