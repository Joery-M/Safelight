import { defineProject } from 'vitest/config';

export default defineProject({
    test: {
        reporters: !process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default'],
        globals: true,
        browser: {
            enabled: true,
            headless: true,
            name: 'chrome'
        }
    }
});
