import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    resolve: {
        conditions: ['development']
    },
    test: {
        globals: true,
        name: 'tswebm',
        environment: 'happy-dom',
        api: {
            port: 6140
        }
    }
});
