// eslint.config.js
import prettier from 'eslint-config-prettier';

export default [
    {
        files: ['project/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                prompt: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
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

    // Config for Node.js files (like fiveserver.config.js)
    {
        files: ['*.js', '**/*.js', '!project/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
                console: 'readonly',
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
