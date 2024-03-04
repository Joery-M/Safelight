import Vue from '@vitejs/plugin-vue';
import { defineProject } from 'vitest/config';

export default defineProject({
    plugins: [Vue()],
    test: {
        globals: true,
        environment: 'jsdom'
    }
});
