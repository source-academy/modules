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
  plugins: ['@typescript-eslint', 'eslint-config-prettier'],
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'eslint-config-prettier'],
  rules: {
    'linebreak-style': 'off',
    'prettier/prettier': ['error'],
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'react/jsx-filename-extension': 'off',
    'no-use-before-define': 'off',
  },
};
