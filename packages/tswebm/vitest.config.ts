import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    plugins: [],
    test: {
        reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        name: 'tswebm',
        environment: 'happy-dom',
        ui: true,
        open: false,
        api: {
            port: 6140
        }
    }
});
