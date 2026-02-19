import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import cypress from 'eslint-plugin-cypress';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    eslint.configs.recommended,
    tseslint.configs.recommended,

    {
        files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
        plugins: {
            '@stylistic': stylistic,
            cypress
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.amd,
                ...globals.jquery,
                ...globals.node,
                ...globals.mocha,
                ...globals.jest,
                ...globals.commonjs
            },
        },
        rules: {
            '@stylistic/indent': ['error', 4],
            'linebreak-style': ['error', 'unix'],
            'no-unused-vars': [
                'error',
                {
                    vars: 'all',
                    args: 'none',
                },
            ],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'max-len': [
                2,
                {
                    code: 80,
                    tabWidth: 4,
                    ignoreUrls: true,
                },
            ],
            'space-before-function-paren': ['error', 'never'],
            'space-in-parens': ['error', 'never'],
            'no-trailing-spaces': ['error'],
            'key-spacing': [
                'error',
                {
                    beforeColon: false,
                },
            ],
            "func-call-spacing": ["error", "never"],

            "cypress/assertion-before-screenshot": "warn",
            "cypress/no-unnecessary-waiting": "warn",
            "cypress/no-assigning-return-values": "error",
            "cypress/no-force": "warn",
            "cypress/no-pause": "error",
            "cypress/no-async-tests": "error",
        },
    }
]);
