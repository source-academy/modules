import stylePlugin from '@stylistic/eslint-plugin';
import type { Linter } from 'eslint';
import * as importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vitestPlugin from '@vitest/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import saLintPlugin from '.';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

export const jsConfig: Linter.Config = {
  name: 'SA JavaScript Recommended Config',
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
};

export const tsConfig: Linter.Config = {
  name: 'SA TypeScript Recommended Config',
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
};

export const vitestConfig: Linter.Config = {
  name: 'SA Testing Config (Vitest)',
  plugins: {
    // @ts-expect-error Something weird going on here with the vitest plugin type
    vitest: vitestPlugin,
  },
  files: [
    '**/__tests__/**/*.ts*',
    '**/__mocks__/**/*.ts*',
    '**/vitest.*.ts'
  ],
  rules: {
    ...vitestPlugin.configs.recommended.rules,
    'vitest/expect-expect': ['error', {
      assertFunctionNames: ['expect*'],
    }],
    'vitest/no-alias-methods': 'off',
    'vitest/no-conditional-expect': 'off',
    'vitest/no-export': 'off',
    'vitest/require-top-level-describe': 'off',
    'vitest/valid-describe-callback': 'off',

    'import/extensions': ['error', 'never', {
      config: 'ignore'
    }]
  }
};

export const tsxConfig: Linter.Config = {
  name: 'SA TSX Config',
  files: ['**/*.tsx'],
  plugins: {
    'react-hooks': reactHooksPlugin,
    'react': reactPlugin
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',

    '@stylistic/jsx-equals-spacing': ['warn', 'never'],
    '@stylistic/jsx-indent': ['warn', 2],
    '@stylistic/jsx-indent-props': ['warn', 2],
    '@stylistic/jsx-props-no-multi-spaces': 'warn',
  }
};
