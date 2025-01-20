import type { Config } from 'tailwindcss';
import primeUI from 'tailwindcss-primeui';

export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,vue}'],
    plugins: [primeUI]
} as Config;
