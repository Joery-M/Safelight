import Vue from '@vitejs/plugin-vue';
import { defineProject } from 'vitest/config';

export default defineProject({
    plugins: [Vue()],
    test: {
        reporters: !process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        name: 'timeline',
        environment: 'happy-dom',
        ui: true,
        open: false
    }
});
