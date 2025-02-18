import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    test: {
        globals: true,
        name: 'timeline',
        api: {
            port: 6139
        },
        browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
        }
    }
});
