// @ts-check
let todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
let todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

/** @type {import('eslint').Linter.Config} */
const eslintConfig = {
  /** @see https://eslint.org/docs/latest/rules/ */
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
    //  'plugin:@typescript-eslint/recommended-type-checked'
  ],

  env: {
    node: true,
    es2022: true
  },

  /** @type {Partial<import('eslint/rules').ESLintRules>} */
  rules: {
    'array-callback-return': [
      'warn',
      {
        // @ts-ignore incorrect type definition
        checkForEach: true
      }
    ],
    'for-direction': 'warn',
    'getter-return': 'warn',
    'no-async-promise-executor': 'warn',
    'no-class-assign': 'warn',
    'no-compare-neg-zero': 'warn',
    'no-cond-assign': [
      'warn',
      'always' // Was "except-parens"
    ],
    // "no-const-assign": 2,
    'no-constant-condition': ['warn', { checkLoops: false }],
    'no-control-regex': 'warn',
    'no-debugger': 'warn',
    // "no-dupe-args": 2,
    'no-dupe-class-members': 'warn',
    'no-dupe-else-if': 'warn',
    'no-dupe-keys': 'warn',
    'no-duplicate-case': 'warn',
    'no-empty-character-class': 'warn',
    'no-empty-pattern': 'warn',
    'no-ex-assign': 'warn',
    'no-fallthrough': 'warn',
    'no-func-assign': 'warn',
    // "no-import-assign": 2,
    'no-inner-declarations': 0, // Was 2
    // "no-invalid-regexp": 2,
    'no-irregular-whitespace': [
      'warn',
      {
        // skipStrings: true,
        // skipComments: false,
        // skipRegExps: false,
        skipTemplates: true
      }
    ],
    'no-loss-of-precision': 'warn',
    'no-misleading-character-class': 'warn',
    // "no-new-symbol": 2,
    // "no-obj-calls": 2,
    // "no-prototype-builtins": 2,
    'no-self-assign': 'warn',
    'no-setter-return': 'warn',
    'no-sparse-arrays': 'warn',
    // "no-this-before-super": 2,
    'no-unexpected-multiline': 'warn',
    'no-unreachable': 'warn',
    'no-unsafe-finally': 'warn',
    // FIXME: Investigate type error
    // 'no-unsafe-negation': [
    //   "warn",
    //   { enforceForOrderingRelations: true },
    // ],
    'no-unsafe-optional-chaining': [2, { disallowArithmeticOperators: true }],
    // FIXME: Investigate type error
    // 'use-isnan': [
    //   "warn",
    //   {
    //     // enforceForSwitchCase: true,
    //     enforceForIndexOf: true,
    //   },
    // ],
    'valid-typeof': ['warn', { requireStringLiterals: true }],

    // [Suggestions]
    // "capitalized-comments": 0, // Allow commented code
    // "class-methods-use-this": 0,
    curly: [
      1,
      'multi-line' // Was "all"
    ],
    // "default-case": 0,
    eqeqeq: 'error',
    'no-caller': 2,
    'no-case-declarations': 'warn',
    'no-else-return': [1, { allowElseIf: false }],
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-implicit-globals': [
      'error',
      {
        lexicalBindings: true
      }
    ],
    'no-invalid-this': 'error',
    'no-octal-escape': 'error',
    'no-shadow': 'warn',
    'no-unneeded-ternary': [
      'error',
      {
        defaultAssignment: false // Use || or ?? instead
      }
    ],
    'no-unused-expressions': 'error',
    'no-unused-labels': 'error',
    'no-useless-call': 'error',
    'no-useless-catch': 'error',
    'no-useless-computed-key': ['error', { enforceForClassMembers: true }],
    'no-useless-concat': 'error',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'error',
    'no-useless-rename': 'error',
    'no-useless-return': 'error',
    'no-var': 'error',
    'no-void': 1,
    'no-warning-comments': [1, { terms: todoTreeKeywordsWarning }],
    'object-shorthand': ['warn', 'always', { avoidExplicitReturnArrows: true }],
    'one-var': [
      1,
      'never' // Was "always"
    ],
    'one-var-declaration-per-line': 1,
    'operator-assignment': 1,
    'prefer-arrow-callback': 1,
    // "prefer-const": 0,
    'prefer-exponentiation-operator': 1,
    'prefer-named-capture-group': 1,
    'prefer-numeric-literals': 1,
    'prefer-object-has-own': 1,
    'prefer-object-spread': 1,
    'prefer-promise-reject-errors': 1,
    'prefer-regex-literals': [1, { disallowRedundantWrapping: true }],
    'prefer-rest-params': 1,
    'prefer-spread': 1,
    'prefer-template': 1,
    'quote-props': [
      1,
      'consistent-as-needed', // Was "always"
      {
        keywords: true,
        // unnecessary: true,
        numbers: true
      }
    ],
    radix: [
      1,
      'as-needed' // Was "always"
    ],
    'require-unicode-regexp': 1,
    'require-yield': 'warn',
    'spaced-comment': [
      'error',
      'always', // Same
      { markers: todoTreeKeywordsAll }
    ],
    '@typescript-eslint/consistent-type-imports': [
      1,
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports'
      }
    ],
    // "strict": 0, // Don't force, though rule configs assume strict errors
    // "symbol-description": 0,
    // "vars-on-top": 0,
    yoda: 1,

    // [Layout & Formatting]
    'array-bracket-newline': [
      1,
      'consistent' // Was "multiline". Limitation: No consistent + multiline
    ],
    'array-bracket-spacing': 1,
    'array-element-newline': [
      1,
      'consistent' // Was "always". Limitation: No consistent + multiline
    ],
    'arrow-parens': 1,
    'arrow-spacing': 1,
    'block-spacing': 1,
    'brace-style': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'comma-style': 1,
    'computed-property-spacing': 1,
    'dot-location': [
      1,
      'property' // Was "object"
    ],
    'eol-last': 'error',
    'func-call-spacing': 1,
    'function-call-argument-newline': [
      1,
      'consistent' // Was "always". Limitation: No consistent + multiline
    ],
    'function-paren-newline': [
      1,
      'consistent' // Was "multiline". Limitation: No consistent + multiline
    ],
    'generator-star-spacing': [
      1,
      'after' // Was "before"
    ],
    'jsx-quotes': 'error',
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'max-statements-per-line': 1,
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 1,
    'nonblock-statement-body-position': 1,
    'object-curly-newline': [
      1,
      {
        multiline: true,
        consistent: true // Same. Only default if no object option
      }
    ],
    'object-curly-spacing': [
      1,
      'always' // Was "never"
    ],
    'object-property-newline': 1,
    'padded-blocks': [
      1,
      'never' // Was "always"
    ],
    // "padding-line-between-statements": 0,
    'rest-spread-spacing': 1,
    semi: 1,
    'semi-spacing': 1,
    'semi-style': 1,
    'space-before-blocks': 1,
    'space-before-function-paren': [
      1,
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': 1,
    'space-infix-ops': 1,
    'space-unary-ops': 1,
    'switch-colon-spacing': 1,
    'template-curly-spacing': 1,
    'template-tag-spacing': 1,
    'unicode-bom': 1,
    'wrap-iife': [
      1,
      'inside', // Was "outside"
      { functionPrototypeMethods: true }
    ],
    // "wrap-regex": 0,
    'yield-star-spacing': 1
  }
};

module.exports = eslintConfig;
