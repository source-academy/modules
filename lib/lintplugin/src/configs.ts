import stylePlugin from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';
// @ts-expect-error Wait for eslint-plugin-import to publish the release that has typescript types
import * as importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import saLintPlugin from '.';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

export const jsConfig = {
  // Global JS Rules
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.es2020
    }
  },
  plugins: {
    import: importPlugin,
    '@stylistic': stylePlugin,
  },
  rules: {
    'import/no-duplicates': ['warn', { 'prefer-inline': false }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        alphabetize: {
          order: 'asc',
          orderImportKind: 'asc'
        },
      }
    ],

    '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    '@stylistic/eol-last': 'warn',
    '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
    '@stylistic/no-mixed-spaces-and-tabs': 'warn',
    '@stylistic/no-multi-spaces': 'warn',
    '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
    '@stylistic/no-trailing-spaces': 'warn',
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
    '@stylistic/semi': ['warn', 'always'],
    '@stylistic/spaced-comment': [
      'warn',
      'always',
      { markers: todoTreeKeywordsAll }
    ],
  }
} satisfies Linter.Config;

export const tsConfig = {
  // Global typescript rules
  files: ['**/*.ts*'],
  languageOptions: {
    // @ts-expect-error typescript eslint's type definitions are different
    parser: tseslint.parser
  },
  plugins: {
    // @ts-expect-error typescript eslint's type definitions are different
    '@typescript-eslint': tseslint.plugin,
    '@sourceacademy': saLintPlugin
  },
  rules: {
    'no-unused-vars': 'off', // Use the typescript eslint rule instead

    '@typescript-eslint/ban-types': 'off', // Was 'error'
    '@typescript-eslint/no-duplicate-type-constituents': 'off', // Was 'error'
    '@typescript-eslint/no-explicit-any': 'off', // Was 'error'
    '@typescript-eslint/no-redundant-type-constituents': 'off', // Was 'error'
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Was 'error'
    '@typescript-eslint/prefer-ts-expect-error': 'warn',
    '@typescript-eslint/sort-type-constituents': 'warn',

    '@sourceacademy/collate-type-imports': 'warn'
  }
} satisfies Linter.Config;
