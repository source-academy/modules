module.exports = {
  "extends": ["./.eslintrc.base.cjs", "plugin:jest/recommended"],
  "plugins": ["jest"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "project": "./tsconfig.test.json"
  }
}