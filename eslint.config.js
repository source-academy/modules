// @ts-check

import js from '@eslint/js';
import saLintPlugin from '@sourceacademy/lint-plugin';
import stylePlugin from '@stylistic/eslint-plugin';
import * as importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';

import tseslint from 'typescript-eslint';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

export default tseslint.config(
  {
    // global ignores
    ignores: [
      '**/*.snap',
      'build/**',
      'lib/buildtools/bin',
      'lib/buildtools/src/build/__test_mocks__',
      'lib/lintplugin/dist.js',
      '**/dist/**',
      'src/**/samples/**',
      '**/*.d.ts'
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
  },
  {
    // global for TSX files
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
  },
  {
    // Rules for bundles and tabs
    files: [
      'src/bundles/**/*.ts*',
      'src/tabs/**/*.ts*',
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: `${import.meta.dirname}/src/tsconfig.json`
      }
    },
    rules: {
      'func-style': ['warn', 'declaration', {
        allowArrowFunctions: true,
        overrides: {
          namedExports: 'declaration'
        }
      }],
      'prefer-const': 'warn', // Was 'error'

      '@typescript-eslint/no-empty-object-type': ['error', {
        allowInterfaces: 'with-single-extends',
        allowWithName: '(?:Props)|(?:State)$'
      }],
      '@typescript-eslint/no-namespace': 'off', // Was 'error'
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
    },
  },
  {
    // Rules for scripts
    files: ['lib/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: `${import.meta.dirname}/lib/tsconfig.json`
      }
    },
    rules: {
      'func-style': 'off',
      'import/extensions': ['error', 'never', { json: 'always' }],
      'no-constant-condition': 'off', // Was 'error',

      '@stylistic/arrow-parens': ['warn', 'as-needed'],

      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch']
    },
  },
  {
    // Rules for devserver,
    files: ['./devserver/**/*.ts*'],
    ignores: ['dist'],
    languageOptions: {
      parserOptions: {
        project: `${import.meta.dirname}/devserver/tsconfig.json`
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
  },
  {
    // Rules for tests
    plugins: {
      'vitest': vitestPlugin,
    },
    files: [
      '**/__tests__/**/*.ts*',
      '**/__mocks__/**/*.ts*',
      '**/vitest.*.ts'
    ],
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
      'vitest/no-alias-methods': 'off',
      'vitest/no-conditional-expect': 'off',
      'vitest/no-export': 'off',
      'vitest/require-top-level-describe': 'off',
      'vitest/valid-describe-callback': 'off',

      'import/extensions': ['error', 'never', {
        config: 'ignore'
      }]
    }
  },
  {
    // Rules for cjs files
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Was 'error'
    }
  },
  {
    // Rules for scripts
    rules: {
      'no-fallthrough': 'off'
    }
  },
  {
    // Rules specifically for tabs
    files: [
      'src/tabs/*/index.tsx',
      'src/tabs/*/src/index.tsx',
    ],
    rules: {
      '@sourceacademy/tab-type': 'error'
    }
  }
);
