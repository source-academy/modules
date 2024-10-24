// @ts-check

import js from '@eslint/js';
import stylePlugin from '@stylistic/eslint-plugin';
import * as importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import typeImportsPlugin from './scripts/dist/typeimports.js';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

export default tseslint.config(
  {
    // global ignores
    ignores: [
      '**/*.snap',
      'build/**',
      'scripts/**/templates/templates/**',
      'scripts/src/build/docs/__tests__/test_mocks/**',
      'scripts/dist',
      'src/**/samples/**'
    ]
  },
  js.configs.recommended,
  {
    // Global JS Rules
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
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
  },
  ...tseslint.configs.recommended,
  {
    // Global typescript rules
    files: ['**/*.ts*'],
    languageOptions: {
      parser: tseslint.parser
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'typeImports': typeImportsPlugin
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

      'typeImports/collate-type-imports': 'warn'
    }
  },
  {
    // global for TSX files
    files: ['**/*.tsx'],
    plugins: {
      'react-hooks': reactHooksPlugin
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',

      '@stylistic/jsx-equals-spacing': ['warn', 'never'],
      '@stylistic/jsx-indent': ['warn', 2],
      '@stylistic/jsx-indent-props': ['warn', 2],
      '@stylistic/jsx-props-no-multi-spaces': 'warn',
    }
  },
  {
    // Rules for bundles and tabs
    files: ['src/**/*.ts*'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './src/tsconfig.json'
      }
    },
    rules: {
      'prefer-const': 'warn', // Was 'error'

      '@typescript-eslint/no-empty-object-type': ['error', {
        allowInterfaces: 'with-single-extends',
        allowWithName: '(?:Props)|(?:State)$'
      }],
      '@typescript-eslint/no-namespace': 'off', // Was 'error'
      '@typescript-eslint/no-var-requires': 'warn', // Was 'error'
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    // Rules for scripts
    files: ['scripts/**/*.ts'],
    ignores: ['scripts/src/templates/templates/**/*.ts*'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './scripts/tsconfig.json'
      }
    },
    rules: {
      'import/extensions': ['error', 'never', { json: 'always' }],
      'no-constant-condition': 'off', // Was 'error',

      '@stylistic/arrow-parens': ['warn', 'as-needed'],

      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch']
    },
    settings: {
      'import/internal-regex': '^@src/',
    },
  },
  {
    // Rules for devserver,
    files: ['devserver/**/*.ts*'],
    ignores: ['dist'],
    languageOptions: {
      parserOptions: {
        project: './devserver/tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
  },
  {
    // Rules for tests
    ...jestPlugin.configs['flat/recommended'],
    files: [
      '**/__tests__/**/*.ts*',
      '**/__mocks__/**/*.ts*',
      '**/jest.setup.ts'
    ],
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
      'jest/no-alias-methods': 'off',
      'jest/no-conditional-expect': 'off',
      'jest/no-export': 'off',
      'jest/require-top-level-describe': 'off',
      'jest/valid-describe-callback': 'off'
    }
  }
);
