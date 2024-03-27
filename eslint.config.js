import js from '@eslint/js';
import stylePlugin from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

const OFF = 0;
const WARN = 1;
const ERROR = 2;

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
      import: importPlugin,
      '@stylistic': stylePlugin,
    },
    rules: {
      'import/no-duplicates': [WARN, { 'prefer-inline': false }],
      'import/order': [
        WARN,
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc'
          },
        }
      ],

      '@stylistic/brace-style': [WARN, '1tbs', { allowSingleLine: true }],
      '@stylistic/eol-last': WARN,
      '@stylistic/indent': [WARN, 2, { SwitchCase: 1 }],
      '@stylistic/no-mixed-spaces-and-tabs': WARN,
      '@stylistic/no-multi-spaces': WARN,
      '@stylistic/no-multiple-empty-lines': [WARN, { max: 1, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': WARN,
      '@stylistic/quotes': [WARN, 'single', { avoidEscape: true }],
      '@stylistic/semi': [WARN, 'always'],
      '@stylistic/spaced-comment': [
        WARN,
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
    },
    rules: {
      'no-unused-vars': OFF, // Use the typescript eslint rule instead

      '@typescript-eslint/ban-types': OFF, // Was ERROR
      '@typescript-eslint/no-duplicate-type-constituents': OFF, // Was ERROR
      '@typescript-eslint/no-explicit-any': OFF, // Was ERROR
      '@typescript-eslint/no-redundant-type-constituents': OFF, // Was ERROR
      '@typescript-eslint/no-unused-vars': [WARN, { argsIgnorePattern: '^_' }], // Was ERROR
      '@typescript-eslint/prefer-ts-expect-error': WARN,
      '@typescript-eslint/sort-type-constituents': WARN,
    }
  },
  {
    // global for TSX files
    files: ['**/*.tsx'],
    plugins: {
      'react-hooks': reactHooksPlugin
    },
    rules: {
      'react-hooks/rules-of-hooks': ERROR,

      '@stylistic/jsx-equals-spacing': [WARN, 'never'],
      '@stylistic/jsx-indent': [WARN, 2],
      '@stylistic/jsx-indent-props': [WARN, 2],
      '@stylistic/jsx-props-no-multi-spaces': WARN,
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
      'prefer-const': WARN, // Was ERROR

      '@typescript-eslint/no-namespace': OFF, // Was ERROR
      '@typescript-eslint/no-var-requires': WARN, // Was ERROR
      '@typescript-eslint/switch-exhaustiveness-check': ERROR,
    },
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
      'import/extensions': [ERROR, 'never', { json: 'always' }],
      'no-constant-condition': OFF, // Was ERROR,
      '@stylistic/arrow-parens': [WARN, 'as-needed'],

      '@typescript-eslint/prefer-readonly': WARN,
      '@typescript-eslint/require-await': ERROR,
      '@typescript-eslint/return-await': [ERROR, 'in-try-catch']
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
      'jest/expect-expect': [ERROR, { assertFunctionNames: ['expect*'] }],
      'jest/no-alias-methods': OFF,
      'jest/no-conditional-expect': OFF,
      'jest/no-export': OFF,
      'jest/require-top-level-describe': OFF,
      'jest/valid-describe-callback': OFF
    }
  }
];
