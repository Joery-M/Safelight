import { defineProject } from 'vitest/config';

export default defineProject({
    define: {
        __TEST__: true
    },
    plugins: [],
    test: {
        globals: true,
        name: 'Daguerreo',
        api: {
            port: 6134
        },
        browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }]
        }
    }
});
