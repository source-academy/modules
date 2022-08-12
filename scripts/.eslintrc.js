// Leaving everything double quoted so it's easier to switch between JS and JSON
// Since JSON has automatic schema validation

module.exports = {
  // Need react here because otherwise we get undefined rule errors
  "plugins": ["import", "react", "@typescript-eslint"],
  "extends": ["../.eslintrc.base.js", "airbnb-typescript"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "func-style": 0,
    "import/no-extraneous-dependencies": 0,
    "no-console": 0,
    "no-continue": 0,
    "no-param-reassign": 0,
    "no-restricted-syntax": 0,
    "prefer-const": 0
  },
  "overrides": [{
    "files": ["./**/__tests__/**.test.ts"],
    "parserOptions": {
      "project": "tsconfig.test.json",
      "tsconfigRootDir": __dirname,
    },
    "extends": ["plugin:jest/recommended"],
    "plugins": ["jest"]
  }]
}