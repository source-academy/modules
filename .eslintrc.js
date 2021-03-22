module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'eslint-plugin-prettier'],
  extends: ['airbnb', 'eslint-config-prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': ['error'],
    // Off camelcase linting to support source bundle functions which are in snake case
    camelcase: 'off',
    // Modify airbnb import/extensions to not include ts and tsx
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
    // Mandating prop-types is unnecessary since we are using typescript
    'react/prop-types': 'off',
    // Allow jsx inside .tsx files
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.tsx'] }],
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
};
