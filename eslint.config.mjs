import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import security from "eslint-plugin-security";
import pluginCypress from "eslint-plugin-cypress";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    ...compat.extends(
        "eslint:recommended",
        "plugin:security/recommended-legacy",
        "plugin:react/recommended",
    ),
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: {
            js,
            security,
            cypress: pluginCypress,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.amd,
                ...globals.jquery,
                ...globals.node,
                ...globals.mocha,
            },
            ecmaVersion: 2018,
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"],
            "no-unused-vars": [
                "error",
                {
                    vars: "all",
                    args: "none",
                },
            ],
            quotes: ["error", "single"],
            semi: ["error", "always"],
            "max-len": [
                2,
                {
                    code: 80,
                    tabWidth: 4,
                    ignoreUrls: true,
                },
            ],
            "space-before-function-paren": ["error", "never"],
            "space-in-parens": ["error", "never"],
            "no-trailing-spaces": ["error"],
            "key-spacing": [
                "error",
                {
                    beforeColon: false,
                },
            ],
            "func-call-spacing": ["error", "never"],
            "security/detect-buffer-noassert": 1,
            "security/detect-child-process": 1,
            "security/detect-disable-mustache-escape": 1,
            "security/detect-eval-with-expression": 1,
            "security/detect-new-buffer": 1,
            "security/detect-no-csrf-before-method-override": 1,
            "security/detect-non-literal-fs-filename": 1,
            "security/detect-non-literal-regexp": 1,
            "security/detect-non-literal-require": 0,
            "security/detect-object-injection": 0,
            "security/detect-possible-timing-attacks": 1,
            "security/detect-pseudoRandomBytes": 1,
            "security/detect-unsafe-regex": 1,

            "cypress/assertion-before-screenshot": "warn",
            "cypress/no-unnecessary-waiting": "warn",
            "cypress/no-assigning-return-values": "error",
            "cypress/no-force": "warn",
            "cypress/no-pause": "error",
            "cypress/no-async-tests": "error",
        },
    },
]);