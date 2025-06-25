// @ts-check

import js from '@eslint/js';
import markdown from '@eslint/markdown';
import saLintPlugin from '@sourceacademy/lint-plugin';
import stylePlugin from '@stylistic/eslint-plugin';
import * as importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import vitestPlugin from 'eslint-plugin-vitest';
import globals from 'globals';
import jsonParser from 'jsonc-eslint-parser';

import tseslint from 'typescript-eslint';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

export default tseslint.config(
  {
    name: 'Global Ignores',
    ignores: [
      '.yarn',
      '**/*.snap',
      'build/**',
      'lib/buildtools/bin',
      'lib/buildtools/src/build/__test_mocks__',
      'lib/lintplugin/dist.js',
      'docs/.vitepress/cache',
      'devserver/vite.config.ts',
      '**/dist/**',
      'src/**/samples/**',
      '**/*.d.ts',
      '**/coverage',
    ]
  },
  {
    name: 'JSON Files',
    files: ['**/*.json'],
    ignores: [
      'src/java/**',
      'package-lock.json' // Just in case someone accidentally creates one
    ],
    languageOptions: {
      parser: jsonParser,
      parserOptions: {
        // Use JSONC so that comments in JSON files don't get treated as
        // syntax errors
        jsonSyntax: 'jsonc'
      }
    },
    plugins: {
      '@stylistic': stylePlugin,
    },
    rules: {
      '@stylistic/eol-last': 'warn',
    }
  },
  {
    name: 'Markdown Files',
    extends: [markdown.configs.recommended],
    files: ['**/*.md'],
    ignores: [
      // These are generated via Typedoc, we don't have to lint them
      'docs/src/lib/modules-lib/**/*.md'
    ],
    language: 'markdown/gfm',
    languageOptions: {
      // @ts-expect-error typescript eslint doesn't recognize this property
      frontmatter: 'yaml'
    },
    plugins: { markdown },
    rules: {
      'markdown/no-missing-label-refs': 'off', // was error
      // Frontmatter titles are used for navigation only, so its okay
      // to have both that and a h1 element
      'markdown/no-multiple-h1': ['error', { frontmatterTitle: '' }],
      'markdown/require-alt-text': 'off', // was error
    }
  },
  {
    extends: [
      js.configs.recommended,
    ],
    name: 'Global JS Rules',
    files: [
      '**/*.*js',
      '**/*.ts',
      '**/*.tsx',
    ],
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
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-cycle': 'error',
      'import/no-duplicates': ['warn', { 'prefer-inline': false }],
      'import/no-useless-path-segments': 'error',
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
  {
    extends: tseslint.configs.recommended,
    name: 'Global Typescript Rules',
    files: ['**/*.ts*'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // Prevent the parser from going any higher in the directory tree
        // to find a tsconfig
        tsconfigRootDir: import.meta.dirname,
        project: true
      }
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
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'off', // Was 'error'
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Was 'error'
      '@typescript-eslint/prefer-ts-expect-error': 'warn',
      '@typescript-eslint/sort-type-constituents': 'warn',
    }
  },
  {
    name: 'Global for TSX Files',
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
    name: 'Rules for bundles and tabs',
    files: [
      'src/bundles/**/*.ts*',
      'src/tabs/**/*.ts*',
    ],
    languageOptions: {
      globals: globals.browser,
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
    name: 'Rules for modules library',
    files: ['lib/**/*.ts'],
    rules: {
      'func-style': 'off',
      'import/extensions': ['error', 'never', { json: 'always' }],
      'no-constant-condition': 'off', // Was 'error',
      'no-fallthrough': 'off',

      '@stylistic/arrow-parens': ['warn', 'as-needed'],

      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch']
    },
  },

  {
    name: 'Rules for Dev Server',
    files: ['devserver/**/*.ts*'],
    ignores: ['dist'],
    languageOptions: {
      parserOptions: {
        globals: {
          ...globals.browser,
          ...globals.node
        },
      },
    }
  },
  {
    name: 'Rules for tests',
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
  },
  {
    name: 'Rules for cjs files',
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Was 'error'
    }
  },
  {
    name: 'Rules specifically for tabs',
    files: [
      'src/tabs/*/index.tsx',
      'src/tabs/*/src/index.tsx',
    ],
    rules: {
      '@sourceacademy/tab-type': 'error'
    }
  },
  {
    name: 'Specifically for buildtools',
    files: ['lib/buildtools/**/*.ts'],
    rules: {
      'import/extensions': ['error', 'ignorePackages']
    }
  },
);
