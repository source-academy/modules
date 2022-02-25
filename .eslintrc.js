let todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
let todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  ignorePatterns: ['build/**/*'],
  rules: {
    'prettier/prettier': 1,
  },
  overrides: [
    {
      files: ['**/*.js'],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      env: {
        node: true,
        es6: true,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ['**/*.js'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      env: {
        browser: true,
        es6: true,
      },
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
      plugins: ['react', '@typescript-eslint', 'eslint-plugin-prettier'],
      extends: ['airbnb-typescript', 'eslint-config-prettier'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'warn',
          {
            selector: 'variable',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'function',
            // Include snake_case for function names for bundle exported functions
            format: ['camelCase', 'snake_case'],
          },
        ],
        // turn on errors for missing imports
        // @see https://www.npmjs.com/package/eslint-import-resolver-typescript
        'import/no-unresolved': 'error',

        // Allow unused arguments if they start with an underscore
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
          },
        ],

        // Allow multiple classes per file, eg a utilities file,
        // rather than creating a bunch of files to separate responsibilities
        'max-classes-per-file': 0,

        // Enable exporting non-destructured variables,
        // so that comments can get used to generate documentation
        'prefer-destructuring': 0,

        // Avoid messy destructuring from deeply nested Props
        'react/destructuring-assignment': 0,

        // Reinstate the default of allowing properties to be reassigned,
        // eg working with canvases
        'no-param-reassign': [1, { props: false }],

        // Account for warning comments
        'spaced-comment': [1, 'always', { markers: todoTreeKeywordsAll }],

        // Error → warn
        '@typescript-eslint/lines-between-class-members': 1,
        'prefer-template': 1,
        'class-methods-use-this': 1,
        'import/prefer-default-export': 1,
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
            alwaysTryTypes: true,
          },
        },
      },
    },
  ],
};
