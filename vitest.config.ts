import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [Vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        open: true,
        api: {
            port: 3002
        },
        browser: {
            enabled: true,
            headless: true,
            name: 'chrome'
        }
    }
});
