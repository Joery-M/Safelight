import Vue from '@vitejs/plugin-vue';
import { defineProject } from 'vitest/config';

export default defineProject({
    plugins: [Vue()],
    test: {
        reporters: !process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        environment: 'jsdom',
        ui: true,
        api: {
            port: 5125
        },
        browser: {
            name: 'chrome',
            enabled: false
        }
    }
});
