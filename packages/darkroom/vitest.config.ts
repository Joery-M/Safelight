import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    test: {
        globals: true,
        name: 'Darkroom',
        browser: {
            enabled: true,
            headless: true,
            name: 'chromium',
            provider: 'playwright'
        },
        api: {
            port: 6135
        }
    }
});
