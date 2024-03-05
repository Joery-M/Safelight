import { defineProject } from 'vitest/config';

export default defineProject({
    test: {
        globals: true,
        browser: {
            enabled: true,
            headless: true,
            name: 'chrome'
        }
    }
});
