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
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'react/jsx-filename-extension': 'off',
    'no-use-before-define': 'off',
    'arrow-body-style': 'off',
    'import/extensions': 'off',
    camelcase: 'off',
    'func-names': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
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
