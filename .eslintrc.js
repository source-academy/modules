module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  ignorePatterns: ['build/**/*'],
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': ['error'],
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
        'prettier/prettier': ['error'],
        '@typescript-eslint/naming-convention': [
          'error',
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
      },
    },
  ],
};
