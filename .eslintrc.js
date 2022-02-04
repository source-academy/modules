module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  ignorePatterns: ['build/**/*'],
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': ['warn'],
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
        'linebreak-style': 'off',
        'prettier/prettier': ['warn'],
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
