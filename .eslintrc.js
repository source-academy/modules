module.exports = {
  extends: ['./.eslintrc.base.js', 'plugin:prettier/recommended'],

  root: true,
  parserOptions: {
    sourceType: 'module',
  },

  rules: {
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
    ],

    'prettier/prettier': 1, // Was 2
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],

      plugins: ['import', 'react', '@typescript-eslint'],
      extends: ['airbnb-typescript', 'plugin:prettier/recommended'],

      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },

      rules: {},
    },
  ],
};
