module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:unicorn/recommended',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:eslint-comments/recommended',
        'prettier',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint',
        'prettier/unicorn',
    ],
    settings: {
        'import/extensions': ['js', 'ts'],
        'import/resolver': {
            typescript: {},
            node: {
                extensions: ['.js', '.ts'],
                paths: ['src', 'test'],
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
        },
    },
    rules: {
        'no-console': [
            'error',
            {
                allow: ['info', 'error'],
            },
        ],
        'prettier/prettier': 'error',
        'newline-before-return': 'error',
        'no-use-before-define': ['error', { functions: false }],
        'require-atomic-updates': 'error',
        '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
        // Disabled as it causes code to be very verbose without much
        // benefit in this project.
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
        'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
        'jest/consistent-test-it': ['error', { fn: 'it' }],
        'jest/expect-expect': [
            'error',
            {
                assertFunctionNames: ['expect'],
            },
        ],
        'jest/lowercase-name': [
            'error',
            {
                ignore: ['describe', 'test'],
            },
        ],
        'import/prefer-default-export': 'off',
        'unicorn/filename-case': 'off',
        // This rule is too intrusive.
        'unicorn/prevent-abbreviations': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'consistent-return': 'warn',
        'default-case': 'warn',
        'unicorn/consistent-function-scoping': 'off',
        'class-methods-use-this': 'off',
    },
    overrides: [
        {
            files: ['jest/*.js'],
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
}
