import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    test: {
        globals: true,
        name: 'timeline',
        environment: 'jsdom',
        api: {
            port: 6139
        },
        browser: {
            enabled: true,
            headless: true,
            name: 'chromium',
            provider: 'playwright'
        }
    }
});
