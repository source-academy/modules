let todoTreeKeywordsWarning = ['TODO', 'TODOS', 'TODO WIP', 'FIXME', 'WIP'];
let todoTreeKeywordsAll = [...todoTreeKeywordsWarning, 'NOTE', 'NOTES', 'LIST'];

module.exports = {
  extends: ['eslint:recommended'],

  env: {
    node: true,
    //NOTE Set to es2022 once VSCode eslint extension updates
    // https://github.com/eslint/eslint/pull/15587
    es2021: true,
  },

  rules: {
    // [Possible Problems]
    'array-callback-return': [
      1,
      {
        // allowImplicit: false,
        checkForEach: true,
      },
    ],
    // "constructor-super": 2,
    'for-direction': 1, // Was 2
    'getter-return': 1, // Was 2
    'no-async-promise-executor': 1, // Was 2
    'no-await-in-loop': 1,
    'no-class-assign': 1, // Was 2
    'no-compare-neg-zero': 1, // Was 2
    'no-cond-assign': [
      1, // Was 2
      'always', // Was "except-parens"
    ],
    // "no-const-assign": 2,
    'no-constant-condition': [
      1, // Was 2
      { checkLoops: false },
    ],
    'no-constructor-return': 1,
    'no-control-regex': 1, // Was 2
    'no-debugger': 1, // Was 2
    // "no-dupe-args": 2,
    'no-dupe-class-members': 1, // Was 2
    'no-dupe-else-if': 1, // Was 2
    'no-dupe-keys': 1, // Was 2
    'no-duplicate-case': 1, // Was 2
    'no-duplicate-imports': 1,
    'no-empty-character-class': 1, // Was 2
    'no-empty-pattern': 1, // Was 2
    'no-ex-assign': 1, // Was 2
    'no-fallthrough': 1, // Was 2
    'no-func-assign': 1, // Was 2
    // "no-import-assign": 2,
    'no-inner-declarations': 0, // Was 2
    // "no-invalid-regexp": 2,
    'no-irregular-whitespace': [
      1, // Was 2
      {
        // skipStrings: true,
        // skipComments: false,
        // skipRegExps: false,
        skipTemplates: true,
      },
    ],
    'no-loss-of-precision': 1, // Was 2
    'no-misleading-character-class': 1, // Was 2
    // "no-new-symbol": 2,
    // "no-obj-calls": 2,
    'no-promise-executor-return': 1,
    // "no-prototype-builtins": 2,
    'no-self-assign': 1, // Was 2
    'no-self-compare': 1,
    'no-setter-return': 1, // Was 2
    'no-sparse-arrays': 1, // Was 2
    'no-template-curly-in-string': 1,
    // "no-this-before-super": 2,
    'no-undef': [2, { typeof: true }],
    'no-unexpected-multiline': 1, // Was 2
    'no-unmodified-loop-condition': 1,
    'no-unreachable': 1, // Was 2
    'no-unreachable-loop': 1,
    'no-unsafe-finally': 1, // Was 2
    'no-unsafe-negation': [
      1, // Was 2
      { enforceForOrderingRelations: true },
    ],
    'no-unsafe-optional-chaining': [2, { disallowArithmeticOperators: true }],
    'no-unused-private-class-members': 1,
    'no-unused-vars': [
      1, // Was 2
      {
        // vars: "all",
        // args: "after-used",
        // ignoreRestSiblings: false,
        argsIgnorePattern: '^_',
        caughtErrors: 'all', // Was "none"
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'no-use-before-define': [
      1,
      {
        functions: false,
        // classes: true,
        // variables: true
      },
    ],
    'no-useless-backreference': 1,
    'require-await': 1,
    'require-atomic-updates': 1,
    'use-isnan': [
      1, // Was 2
      {
        // enforceForSwitchCase: true,
        enforceForIndexOf: true,
      },
    ],
    'valid-typeof': [
      1, // Was 2
      { requireStringLiterals: true },
    ],

    // [Suggestions]
    'accessor-pairs': 1,
    'arrow-body-style': 1,
    'block-scoped-var': 1,
    camelcase: 1,
    // "capitalized-comments": 0, // Allow commented code
    // "class-methods-use-this": 0,
    complexity: 1,
    'consistent-return': 1,
    'consistent-this': 1,
    curly: [
      1,
      'multi-line', // Was "all"
    ],
    // "default-case": 0,
    'default-case-last': 1,
    'default-param-last': 1,
    'dot-notation': 1,
    eqeqeq: 1,
    'func-name-matching': [
      1,
      'always', // Same
      {
        considerPropertyDescriptor: true,
        // includeCommonJSModuleExports: false
      },
    ],
    // "func-names": 0,
    'func-style': [
      1,
      'declaration', // Was "expression"
    ],
    'grouped-accessor-pairs': [
      1,
      'getBeforeSet', // Was "anyOrder"
    ],
    // "guard-for-in": 0,
    // "id-denylist": 0,
    // "id-length": 0,
    // "id-match": 0,
    // "init-declarations": 0,
    // "max-classes-per-file": 0,
    // "max-depth": 0,
    // "max-lines": 0,
    // "max-lines-per-function": 0,
    // "max-nested-callbacks": 0,
    // "max-params": 0,
    // "max-statements": 0,
    // "multiline-comment-style": 0,
    'new-cap': 1,
    // "no-alert": 0,
    'no-array-constructor': 1,
    'no-bitwise': 1,
    'no-caller': 2,
    'no-case-declarations': 1, // Was 2
    'no-confusing-arrow': 1,
    // "no-console": 0,
    // "no-continue": 0,
    // "no-delete-var": 2,
    // "no-div-regex": 0,
    'no-else-return': [1, { allowElseIf: false }],
    'no-empty': [
      1, // Was 2
      { allowEmptyCatch: true },
    ],
    'no-empty-function': 1,
    'no-eq-null': 1,
    // "no-eval": 0,
    'no-extend-native': 1,
    'no-extra-bind': 1,
    'no-extra-boolean-cast': [
      1, // Was 2
      { enforceForLogicalOperands: true },
    ],
    'no-extra-label': 1,
    'no-extra-semi': 1, // Was 2
    'no-floating-decimal': 1,
    // "no-global-assign": 2,
    'no-implicit-coercion': 1,
    'no-implicit-globals': [1, { lexicalBindings: true }],
    'no-implied-eval': 1,
    // "no-inline-comments": 0,
    'no-invalid-this': 2,
    'no-iterator': 1,
    'no-label-var': 1,
    // "no-labels": 0,
    'no-lone-blocks': 1,
    'no-lonely-if': 1,
    'no-loop-func': 1,
    // "no-magic-numbers": 0,
    'no-mixed-operators': 0,
    'no-multi-assign': 1,
    'no-multi-str': 1,
    // "no-negated-condition": 0,
    // "no-nested-ternary": 0,
    'no-new': 1,
    'no-new-func': 1,
    'no-new-object': 1,
    'no-new-wrappers': 1,
    // "no-nonoctal-decimal-escape": 2,
    // "no-octal": 2,
    'no-octal-escape': 2,
    // "no-param-reassign": 0,
    // "no-plusplus": 0,
    'no-proto': 1,
    'no-redeclare': 1, // Was 2
    'no-regex-spaces': 1, // Was 2
    // "no-restricted-exports": 0,
    // "no-restricted-globals": 0,
    // "no-restricted-imports": 0,
    // "no-restricted-properties": 0,
    // "no-restricted-syntax": 0,
    'no-return-assign': 1,
    'no-return-await': 1,
    'no-script-url': 1,
    'no-sequences': 1,
    'no-shadow': [
      1,
      {
        builtinGlobals: true,
        // hoist: "functions"
      },
    ],
    // "no-shadow-restricted-names": 2,
    // "no-ternary": 0,
    'no-throw-literal': 1,
    'no-undef-init': 1,
    // "no-undefined": 0,
    // "no-underscore-dangle": 0,
    'no-unneeded-ternary': [
      1,
      {
        defaultAssignment: false, // Use || or ?? instead
      },
    ],
    'no-unused-expressions': 1,
    'no-unused-labels': 1, // Was 2
    'no-useless-call': 1,
    'no-useless-catch': 1, // Was 2
    'no-useless-computed-key': [1, { enforceForClassMembers: true }],
    'no-useless-concat': 1,
    'no-useless-constructor': 1,
    'no-useless-escape': 1, // Was 2
    'no-useless-rename': 1,
    'no-useless-return': 1,
    'no-var': 1,
    'no-void': 1,
    'no-warning-comments': [
      1,
      {
        terms: todoTreeKeywordsWarning,
        // location: "start"
      },
    ],
    // "no-with": 2,
    'object-shorthand': [
      1,
      'always', // Same
      {
        // avoidQuotes: false,
        // ignoreConstructors: false,
        avoidExplicitReturnArrows: true,
      },
    ],
    'one-var': [
      1,
      'never', // Was "always"
    ],
    'one-var-declaration-per-line': 1,
    'operator-assignment': 1,
    'prefer-arrow-callback': 1,
    // "prefer-const": 0,
    // "prefer-destructuring": 0,
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
        numbers: true,
      },
    ],
    radix: [
      1,
      'as-needed', // Was "always"
    ],
    'require-await': 1,
    'require-unicode-regexp': 1,
    'require-yield': 1, // Was 2
    // "sort-keys": 0,
    // "sort-vars": 0,
    'spaced-comment': [
      1,
      'always', // Same
      { markers: todoTreeKeywordsAll },
    ],
    '@typescript-eslint/consistent-type-imports': [
      1,
      {
        fixStyle: 'inline-type-imports',
        prefer: 'type-imports',
      }
    ],
    // "strict": 0, // Don't force, though rule configs assume strict errors
    // "symbol-description": 0,
    // "vars-on-top": 0,
    yoda: 1,

    // [Layout & Formatting]
    'array-bracket-newline': [
      1,
      'consistent', // Was "multiline". Limitation: No consistent + multiline
    ],
    'array-bracket-spacing': 1,
    'array-element-newline': [
      1,
      'consistent', // Was "always". Limitation: No consistent + multiline
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
      'property', // Was "object"
    ],
    'eol-last': 1,
    'func-call-spacing': 1,
    'function-call-argument-newline': [
      1,
      'consistent', // Was "always". Limitation: No consistent + multiline
    ],
    'function-paren-newline': [
      1,
      'consistent', // Was "multiline". Limitation: No consistent + multiline
    ],
    'generator-star-spacing': [
      1,
      'after', // Was "before"
    ],
    'implicit-arrow-linebreak': 1,
    indent: [
      1,
      'tab', // Was 4
      {
        SwitchCase: 1, // Was 0
        // VariableDeclarator: 1,
        // outerIIFEBody: 1,
        // MemberExpression: 1,
        // FunctionDeclaration: {
        // 	parameters: 1,
        // 	body: 1
        // },
        // FunctionExpression: {
        // 	parameters: 1,
        // 	body: 1
        // },
        // StaticBlock: {
        // 	body: 1
        // },
        // CallExpression: {
        // 	arguments: 1,
        // },
        // ArrayExpression: 1,
        // ObjectExpression: 1,
        // ImportDeclaration: 1,
        // flatTernaryExpressions: false,
        // offsetTernaryExpressions: false,
        // ignoreComments: false
      },
    ],
    'jsx-quotes': 1,
    'key-spacing': 1,
    'keyword-spacing': 1,
    // "line-comment-position": 0,
    'linebreak-style': [
      1,
      'windows', // Was "unix"
    ],
    // "lines-around-comment": 0,
    // "lines-between-class-members": 0,
    // "max-len": 0,
    'max-statements-per-line': 1,
    'multiline-ternary': [
      1,
      'always-multiline', // Was "always"
    ],
    'new-parens': 1,
    'newline-per-chained-call': [
      1,
      {
        ignoreChainWithDepth: 1, // Was 2
      },
    ],
    // "no-extra-parens": 0, // Limitation: No exception for ternary conditions
    'no-mixed-spaces-and-tabs': 1, // Was 2
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': [
      1,
      {
        max: 3, // Was 2
        maxEOF: 0,
        maxBOF: 0,
      },
    ],
    // "no-tabs": 0, // Limitation: allowIndentationTabs doesn't allow partial tabs from commenting a block with deeper indentation
    'no-trailing-spaces': 1,
    'no-whitespace-before-property': 1,
    'nonblock-statement-body-position': 1,
    'object-curly-newline': [
      1,
      {
        multiline: true,
        consistent: true, // Same. Only default if no object option
      },
    ],
    'object-curly-spacing': [
      1,
      'always', // Was "never"
    ],
    'object-property-newline': 1,
    'operator-linebreak': [
      1,
      'before', // Was "after"
    ],
    'padded-blocks': [
      1,
      'never', // Was "always"
    ],
    // "padding-line-between-statements": 0,
    quotes: [
      1,
      'double', // Same
      {
        avoidEscape: true,
        // allowTemplateLiterals: false
      },
    ],
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
        asyncArrow: 'always',
      },
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
      { functionPrototypeMethods: true },
    ],
    // "wrap-regex": 0,
    'yield-star-spacing': 1,
  },
};
