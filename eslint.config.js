// @ts-check
// TODO Split configuration when it becomes possible in ESLint V10

import js from '@eslint/js';
import markdown from '@eslint/markdown';
import saLintPlugin from '@sourceacademy/lint-plugin';
import stylePlugin from '@stylistic/eslint-plugin';
import vitestPlugin from '@vitest/eslint-plugin';
import * as importPlugin from 'eslint-plugin-import';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import ymlPlugin from 'eslint-plugin-yml';
import globals from 'globals';
import jsonParser from 'jsonc-eslint-parser';
import tseslint from 'typescript-eslint';

const todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
const todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

export default tseslint.config(
  {
    name: 'Global Ignores',
    ignores: [
      '**/coverage',
      '**/*.snap',
      '**/*.d.ts',
      '**/dist/**',
      '**/dist.*js',
      '.yarn',
      'build/**',
      'docs/.vitepress/cache',
      'devserver/vite.config.ts', // Don't lint this because there's no tsconfig properly configured for it
      'node_modules',
      'lib/buildtools/bin',
      'lib/buildtools/src/build/__test_mocks__',
      'src/**/samples/**',
      'src/bundles/scrabble/src/words.json', // Don't lint this because its way too big
      'src/java/**',
      'package-lock.json' // Just in case someone accidentally creates one
    ]
  },
  // #region markdown
  {
    name: 'Markdown Files',
    extends: [markdown.configs.recommended],
    files: ['**/*.md'],
    ignores: [
      // These are generated via Typedoc, we don't have to lint them
      'docs/src/lib/modules-lib/**/*.md',
    ],
    language: 'markdown/gfm',
    languageOptions: {
      // @ts-expect-error typescript eslint doesn't recognize this property
      frontmatter: 'yaml'
    },
    plugins: { markdown },
    rules: {
      'markdown/no-missing-label-refs': 'off', // was error
      'markdown/no-multiple-h1': 'off',        // was error
      'markdown/require-alt-text': 'off',      // was error
    }
  },
  // #endregion markdown

  {
    name: 'Global Configuration (Excluding Markdown)',
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
  },
  {
    name: 'YML Files',
    extends: [ymlPlugin.configs['flat/recommended']],
    files: ['**/*.yml', '**/*.yaml'],
    plugins: {
      yml: ymlPlugin
    },
    rules: {
      'yml/indent': 'warn',
      'yml/no-tab-indent': 'error',

      // based on https://ota-meshi.github.io/eslint-plugin-yml/rules/spaced-comment.html
      '@stylistic/spaced-comment': 'off',
      'yml/spaced-comment': 'warn'
    }
  },
  {
    name: 'JSON Files',
    files: ['**/*.json'],
    languageOptions: {
      parser: jsonParser,
      parserOptions: {
        // Use JSONC so that comments in JSON files don't get treated as
        // syntax errors
        jsonSyntax: 'jsonc'
      }
    }
  },
  {
    extends: [js.configs.recommended],
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
      jsdoc: jsdocPlugin,
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

      'jsdoc/check-alignment': 'warn',
      'jsdoc/require-asterisk-prefix': 'warn',

      'no-empty': ['error', { allowEmptyCatch: true }],

      '@sourceacademy/region-comment': 'error',

      '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/function-paren-newline': ['warn', 'multiline-arguments'],
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/object-curly-newline': ['warn', {
        ImportDeclaration: { multiline: true },
      }],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['warn', 'always'],
    }
  },
  // #region typescript
  {
    extends: tseslint.configs.recommended,
    name: 'Global Typescript Rules',
    files: ['**/*.{ts,tsx}'],
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
    },
    rules: {
      'no-unused-vars': 'off', // Use the typescript eslint rule instead

      'jsdoc/no-types': 'warn',

      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-types': 'off', // Was 'error'
      '@typescript-eslint/no-duplicate-type-constituents': 'off', // Was 'error'
      '@typescript-eslint/no-explicit-any': 'off', // Was 'error'
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-redundant-type-constituents': 'off', // Was 'error'
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Was 'error'

      '@stylistic/type-annotation-spacing': ['warn', { overrides: { colon: { before: false, after: true }}}],
    }
  },
  // #endregion typescript
  {
    name: 'Global for TSX Files',
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
    name: 'Rules specifically for bundles',
    files: ['src/bundles/*/src/index.ts'],

    rules: {
      // rule ref: https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-file-overview.md#readme
      'jsdoc/require-file-overview': ['error', {
        tags: {
          module: {
            mustExist: true,
            preventDuplicates: true,
            initialCommentsOnly: true
          }
        }
      }]
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
    name: 'Rules for modules libraries',
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
      'vitest/require-top-level-describe': 'off',
      'vitest/valid-describe-callback': 'off',
      'vitest/valid-expect-in-promise': 'error',

      'import/extensions': ['error', 'never', {
        config: 'ignore'
      }]
    }
  },
  {
    name: 'Rules specifically for files that interact with Node only',
    files: [
      'lib/buildtools/**/*.ts',
      'lib/repotools/**/*.ts',
      '.github/actions/**/*.ts',
      '**/vitest.config.js'
    ],
    rules: {
      'import/extensions': ['error', 'ignorePackages'],
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
