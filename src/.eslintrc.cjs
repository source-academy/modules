// @ts-check

/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
  extends: ['../.eslintrc.base.cjs'],
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
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'all',
        ignoreRestSiblings: false,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_'
      }
    ],
    '@typescript-eslint/consistent-type-imports': 'error',

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
