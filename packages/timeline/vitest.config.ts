import Vue from '@vitejs/plugin-vue';
import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    plugins: [Vue()],
    test: {
        reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        name: 'timeline',
        environment: 'jsdom',
        ui: true,
        open: false,
        api: {
            port: 6139
        }
    }
});
