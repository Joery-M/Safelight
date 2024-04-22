import { defineProject } from 'vitest/config';

export default defineProject({
    test: {
        reporters: !process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        name: 'Darkroom',
        ui: true,
        open: false,
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
