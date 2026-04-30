// eslint.config.js
import prettier from 'eslint-config-prettier';

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                localStorage: 'readonly',
                Event: 'readonly',
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            // Possible problems
            'no-unused-vars': 'warn',
            'no-undef': 'error',

            // Best practices
            'no-console': 'off',
            'no-debugger': 'warn',

            // Turn OFF stylistic rules (Prettier handles formatting)
            semi: 'off',
            quotes: 'off',
            indent: 'off',
        },
    },

    // Disables all rules that conflict with Prettier
    prettier,
];
