/* eslint-disable @typescript-eslint/ban-ts-comment */

import js from '@eslint/js';
import vueI18n from '@intlify/eslint-plugin-vue-i18n';
import unocss from '@unocss/eslint-plugin';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import eslintPluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import ts from 'typescript-eslint';
import { fileURLToPath } from 'url';

export default defineConfig(
    {
        ignores: ['**/dist/**', '**/node_modules/**', 'packages/sl-core/src/binding/**']
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    ...eslintPluginVue.configs['flat/recommended'],
    {
        files: ['**/packages/safelight/**/*.vue', '**/packages/shared/**/*.vue'],
        settings: {
            unocss: {
                configPath: fileURLToPath(
                    new URL('./packages/safelight/unocss.config.ts', import.meta.url)
                )
            }
        },
        // @ts-ignore
        extends: [unocss.configs.flat]
    },

    // ----- i18n -----
    {
        extends: vueI18n.configs['flat/recommended'],
        files: ['**/packages/safelight/**/*.vue', '**/packages/shared/**/*.vue'],
        ignores: ['dist/**', 'generated/**', '**/*.scss', '**/views/dev/**'],
        settings: {
            'vue-i18n': {
                localeDir: './packages/shared/src/Localization/i18n/*.json'
            }
        },
        rules: {
            '@intlify/vue-i18n/no-raw-text': [
                'warn',
                {
                    attributes: {
                        '/.+/': [
                            'title',
                            'aria-label',
                            'aria-describedby',
                            'aria-placeholder',
                            'aria-roledescription',
                            'aria-valuetext'
                        ],
                        input: ['placeholder'],
                        img: ['alt']
                    },
                    ignoreNodes: ['md-icon', 'v-icon'],
                    ignorePattern: '^[-#:()&]+$'
                }
            ]
        }
    },

    prettierConfig,
    {
        files: ['*.vue', '**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    },
    {
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
                sourceType: 'module',
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            'no-unused-vars': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-multiple-template-root': 'off',

            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true
                }
            ],

            'vue/no-v-for-template-key': 'off',
            'vue/no-v-model-argument': 'off',
            'no-async-promise-executor': 'off',
            'no-undef': 'off',
            'no-dupe-class-members': 'off'
        }
    },
    {
        files: ['**/*.json'],
        rules: {
            'no-unused-expressions': 'off',
            '@typescript-eslint/no-unused-expressions': 'off'
        }
    }
);
