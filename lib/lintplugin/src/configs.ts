import markdown from '@eslint/markdown';
import stylePlugin from '@stylistic/eslint-plugin';
import vitestPlugin from '@vitest/eslint-plugin';
import { defineConfig } from 'eslint/config';
import * as importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import saLintPlugin from '.';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

/**
 * Recommended base configuration for styling. Does not include markdown files
 * because the markdown code processor doesn't support the stylistic rules
 */
export const styleConfig = defineConfig({
  // We exclude markdown because the markdown code processor doesn't support
  // some rules
  ignores: ['**/*.md'],
  plugins: {
    '@stylistic': stylePlugin,
  },
  rules: {
    '@stylistic/eol-last': 'warn',
    '@stylistic/indent': ['warn', 2, { SwitchCase: 1 }],
    '@stylistic/no-mixed-spaces-and-tabs': 'warn',
    '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
    '@stylistic/no-multi-spaces': ['warn', { ignoreEOLComments: true }],
    '@stylistic/no-trailing-spaces': 'warn',
    '@stylistic/spaced-comment': [
      'warn',
      'always',
      { markers: todoTreeKeywordsAll }
    ],
  }
});

/**
 * Recommended configuration for working with JSDoc annotations
 */
export const jsdocConfig = defineConfig(
  {
    files: [
      '**/*.*js',
      '**/*.ts',
      '**/*.tsx',
    ],
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      'jsdoc/check-alignment': 'warn',
      'jsdoc/require-asterisk-prefix': 'warn',
    }
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
    ],
    // Typescript files should not need JSDoc type annotations
    rules: {
      'jsdoc/no-types': 'warn',
    }
  }
);

/**
 * Recommended linting rules for all Javascript, Typescript and Typescript React files
 */
export const jsConfig = defineConfig(
  {
    name: 'SA Recommended Javascript Configuration',
    extends: [stylePlugin.configs.recommended],
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
      '@sourceacademy': saLintPlugin
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
          named: {
            import: true,
            types: 'types-last'
          },
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc'
          },
        }
      ],

      'no-empty': ['error', { allowEmptyCatch: true }],

      '@sourceacademy/default-import-name': ['warn', { path: 'pathlib' }],
      '@sourceacademy/region-comment': 'error',

      '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/function-paren-newline': ['warn', 'multiline-arguments'],
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/object-curly-newline': ['warn', {
        ImportDeclaration: { multiline: true },
      }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['warn', 'always'],
    }
  },
  {
    name: 'Rules for cjs files',
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Was 'error'
    }
  }
);

/**
 * Recommended linting rules for all Typescript and Typescript React files
 */
export const tsConfig = tseslint.config({
  extends: tseslint.configs.recommended,
  name: 'Global Typescript Rules',
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      // Prevent the parser from going any higher in the directory tree
      // to find a tsconfig
      project: true
    }
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin,
  },
  rules: {
    'no-unused-vars': 'off', // Use the typescript eslint rule instead

    'jsdoc/no-types': 'warn',

    '@stylistic/type-annotation-spacing': ['warn', { overrides: { colon: { before: false, after: true } } }],

    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/ban-types': 'off', // Was 'error'
    '@typescript-eslint/no-duplicate-type-constituents': 'off', // Was 'error'
    '@typescript-eslint/no-explicit-any': 'off', // Was 'error'
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/no-redundant-type-constituents': 'off', // Was 'error'
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Was 'error'
  }
});

/**
 * Recommended configuration for Typescript React
 */
export const tsxConfig = defineConfig({
  name: 'SA TSX Config',
  files: ['**/*.tsx'],
  plugins: {
    'react-hooks': reactHooksPlugin,
    'react': reactPlugin
  },
  extends: [
    reactPlugin.configs.flat.recommended,
    reactPlugin.configs.flat['jsx-runtime']
  ],
  languageOptions: {
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-key': 'off', // was 'error'
    'react/prefer-stateless-function': 'warn',
    'react/prop-types': 'off', // was 'error'

    '@stylistic/jsx-equals-spacing': ['warn', 'never'],
    '@stylistic/jsx-indent-props': ['warn', 2],
    '@stylistic/jsx-props-no-multi-spaces': 'warn',
    '@stylistic/jsx-self-closing-comp': 'warn',
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
});

/**
 * Recommended configuration for testing done with the `vitest` library
 */
export const vitestConfig = defineConfig({
  name: 'SA Recommended Vitest Config',
  extends: [vitestPlugin.configs.recommended],
  plugins: {
    vitest: vitestPlugin,
  },
  files: [
    '**/__tests__/**/*.ts*',
    '**/__mocks__/**/*.ts*',
    '**/vitest.*.ts'
  ],
  rules: {
    'no-empty-pattern': 'off', // vitest requires certain things to be destructured using an object pattern

    '@stylistic/quotes': 'off', // Turn this off to avoid conflicting with snapshots

    'vitest/expect-expect': ['error', {
      assertFunctionNames: ['expect*'],
    }],
    'vitest/no-alias-methods': 'off',
    'vitest/no-conditional-expect': 'off',
    'vitest/no-export': 'off',
    'vitest/no-focused-tests': ['warn', { fixable: false }],
    'vitest/require-top-level-describe': 'off',
    'vitest/prefer-hooks-on-top': 'warn',
    'vitest/valid-describe-callback': 'off',
    'vitest/valid-expect-in-promise': 'error',

    'import/extensions': ['error', 'never', {
      config: 'ignore'
    }]
  }
});

/**
 * Recommended configuration for markdown files
 */
export const markdownConfig = defineConfig({
  name: 'Markdown Files',
  extends: [markdown.configs.recommended],
  files: ['**/*.md'],
  language: 'markdown/gfm',
  languageOptions: {
    frontmatter: 'yaml'
  },
  plugins: { markdown },
  rules: {
    'markdown/no-missing-label-refs': 'off', // was error
    'markdown/no-multiple-h1': 'off',        // was error
    'markdown/require-alt-text': 'off',      // was error
  }
});
