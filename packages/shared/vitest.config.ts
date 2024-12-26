import Vue from '@vitejs/plugin-vue';
import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    plugins: [Vue()],
    test: {
        globals: true,
        environment: 'happy-dom',
        name: 'shared',
        api: {
            port: 6138
        }
    }
});
