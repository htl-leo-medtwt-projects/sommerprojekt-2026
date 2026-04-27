/**
 * @see https://prettier.io/docs/configuration
 */
const config = {
    trailingComma: 'all',
    tabWidth: 4,
    singleQuote: true,
    overrides: [
        {
            files: '*.md',
            options: {
                tabWidth: 2,
            },
        },
    ],
};

export default config;
