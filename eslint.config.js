import js from '@eslint/js';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import reactPlugin from 'eslint-plugin-react';
import tseslint from 'typescript-eslint'

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
  {
    // global ignores
    ignores: [
      'src/**/samples/**',
      'scripts/**/templates/templates/**',
      'scripts/bin.js',
      'build/**',

      // TODO: Remove these when eslint supports import assertions
      // or if we decide to use the babel parser that's fine too
      'scripts/scripts_manager.js',
      'scripts/jest.config.js'
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
      import: importPlugin
    },
    rules: {
      'eol-last': 1,
      'import/no-duplicates': [1, { 'prefer-inline': true }],
      'import/order': 1,
      indent: [1, 2, { SwitchCase: 1 }],
      'no-mixed-spaces-and-tabs': 1,
      'spaced-comment': [
        1,
        'always', // Same
        { markers: todoTreeKeywordsAll }
      ],     
      quotes: [1, 'single', { avoidEscape: true }],
      semi: 0,
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
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      'no-unused-vars': 0, // Use the typescript eslint rule instead

      '@typescript-eslint/ban-types': 0, // Was 2
      '@typescript-eslint/no-duplicate-type-constituents': 0, // Was 2,
      '@typescript-eslint/no-explicit-any': 0, // Was 2
      '@typescript-eslint/no-redundant-type-constituents': 0, // Was 2,
      '@typescript-eslint/no-unused-vars': [1, { argsIgnorePattern: '^_' }], // Was 2
      '@typescript-eslint/prefer-ts-expect-error': 1,
      '@typescript-eslint/sort-type-constituents': 1,
    }
  },
  {
    // Rules for bundles and tabs
    files: ['src/**/*.ts*'],
    ignores: [
      '**/__tests__/**/*.ts*',
      '**/__mocks__/**/*.ts',
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './src/tsconfig.json'
      }
    },
    rules: {
      'prefer-const': 1, // Was 2

      '@typescript-eslint/no-namespace': 0, // Was 2
      '@typescript-eslint/no-var-requires': 1, // Was 2
      '@typescript-eslint/switch-exhaustiveness-check': 2,
    },
    plugins: {
      react: reactPlugin,
    }
  },
  {
    // Rules for scripts
    files: ['scripts/**/*.ts'],
    ignores: [
      '**/__tests__/**/*.ts',
      '**/__mocks__/**/*.ts',
      'scripts/src/templates/templates/**/*.ts*'
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './scripts/tsconfig.json'
      }
    },
    rules: {
      'arrow-parens': [1, 'as-needed'],
      'import/extensions': [2, 'never', { json: 'always' }],
      'no-constant-condition': 0, // Was 2,

      '@typescript-eslint/prefer-readonly': 1,
      '@typescript-eslint/require-await': 2,
      '@typescript-eslint/return-await': [2, 'in-try-catch']
    }
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
        ...globals.node2020
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
    ignores: ['**/*.snap'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.test.json'
      }
    },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/expect-expect': [2, { assertFunctionNames: ['expect*'] }],
      'jest/no-alias-methods': 0,
      'jest/no-conditional-expect': 0,
      'jest/no-export': 0,
      'jest/require-top-level-describe': 0,
      'jest/valid-describe-callback': 0
    }
  }
]
