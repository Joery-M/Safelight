import { defineProject, mergeConfig } from 'vitest/config';
import config from './vitest.config';

export default mergeConfig(
    config,
    defineProject({
        test: {
            name: 'Darkroom Firefox',
            browser: {
                name: 'firefox'
            },
            api: {
                port: 6136
            }
        }
    })
);
