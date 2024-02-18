// @ts-check

/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
  extends: ['../.eslintrc.base.cjs', 'airbnb-typescript'],
  ignorePatterns: ['**/__tests__/**', '**/__mocks__/**', '**/*.*js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  plugins: ['import', 'react', 'jsx-a11y', '@typescript-eslint'],
  /** @type {Partial<import('eslint/rules').ESLintRules>} */
  rules: {
    'func-style': 'off',
    indent: [
      'warn',
      2,
      {
        SwitchCase: 1
        // StaticBlock: {
        // 	body: 1
        // },
        // offsetTernaryExpressions: false,
      }
    ],
    quotes: ['warn', 'single', { avoidEscape: true }],

    // [typescript-eslint Extension Rules]
    /* NOTE
      .eslintrc.base.js has been configured for every rule off the
      eslint:recommended config as of V8.
      A similar complete config but for all typescript-eslint rules hasn't
      been made, instead simply using airbnb-typescript's layers of
      extended configs & plugins.

      This section is for reconfiguring the typescript-eslint extension
      rules configured by airbnb-typescript that have replaced their eslint
      equivalents, to make them match the behaviour in .eslintrc.base.js
    */
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        // vars: "all",
        // args: "after-used",
        // ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
        caughtErrors: 'all', // Was "none"
        caughtErrorsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/no-use-before-define': [
      'warn',
      {
        functions: false
        // classes: true,
        // variables: true,
        // enums: true, // TS
        // typedefs: true, // TS
        // ignoreTypeReferences: true, // TS
      }
    ],
    '@typescript-eslint/default-param-last': 'warn',
    '@typescript-eslint/no-shadow': [
      'warn',
      {
        builtinGlobals: true
        // hoist: "functions",
        // ignoreTypeValueShadow: true, // TS
        // ignoreFunctionTypeParameterNameValueShadow: true, // TS
      }
    ],
    '@typescript-eslint/lines-between-class-members': 'off',
    // "@typescript-eslint/consistent-type-imports": 1,

    // [Error → Warn]
    /* NOTE
      This section is for reducing the severity of rules configured by
      airbnb-typescript from 2 to 1, if the problems they point out do not
      have the possibility of directly leading to errors
    */

    // [Other]
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        // Was ["camelCase", "PascalCase", "UPPER_CASE"].
        // Add snake case to let exported module variables match Source
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case']
      },
      {
        selector: 'function',
        // Was ["camelCase", "PascalCase"].
        // Add snake case to let exported module functions match Source
        format: ['camelCase', 'PascalCase', 'snake_case']
      },
      {
        selector: 'typeLike',
        format: ['PascalCase']
      }
    ]
  },
  overrides: [
    {
      extends: ['../.eslintrc.test.cjs'],
      files: ['**/__tests__/**', '**/__mocks__/**']
    },
    {
      extends: ['../.eslintrc.base.cjs'],
      files: ['**/*.*.js']
    }
  ]
};

module.exports = eslintConfig;
