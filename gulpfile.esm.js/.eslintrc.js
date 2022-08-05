module.exports = {
  extends: ['../.eslintrc.base.js', 'plugin:prettier/recommended'],

  root: true,
  parserOptions: {
    sourceType: 'module',
  },

  rules: {
    'func-style': 0,
    indent: [
      1,
      2, // Was "tabs"
      {
        SwitchCase: 1, // Same
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
    quotes: [
      1,
      'single', // Was "double"
      {
        avoidEscape: true, // Same
        // allowTemplateLiterals: false
      },
    ],

    'prettier/prettier': 1, // Was 2
  },

  overrides: [
    {
      files: ['**/**.js'],
      extends: ['airbnb', 'plugin:prettier/recommended'],
      parserOptions: {
        ecmaVersion: '2020',
      },
      rules: {
        'import/no-extraneous-dependencies': 0,
        'no-console': 0,
        'no-param-reassign': 0,
        'no-restricted-syntax': 0,
        'prefer-const': 0,
        'prettier/prettier': 1, // Was 2
      },
    },
  ],
};
