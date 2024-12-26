import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    plugins: [],
    test: {
        globals: true,
        environment: 'jsdom',
        name: 'daguerreo',
        api: {
            port: 6134
        }
    }
});
