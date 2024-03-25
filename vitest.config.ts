import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [Vue()],
    test: {
        reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        environment: 'jsdom',
        open: true,
        ui: true,
        api: {
            port: 5125
        },
        browser: {
            enabled: true,
            headless: true,
            name: 'chrome'
        }
    }
});
