// Leaving everything double quoted so it's easier to switch between JS and JSON
// Since JSON has automatic schema validation

module.exports = {
  // Need react here because otherwise we get undefined rule errors
  "plugins": ["import", "react", "simple-import-sort", "@typescript-eslint"],
  "extends": ["../.eslintrc.base.js", "airbnb-typescript"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2022,
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "array-callback-return": [2, { "checkForEach": false }],
    "func-style": 0,
    "import/no-extraneous-dependencies": 0,
    "no-console": 0,
    "no-continue": 0,
    "no-param-reassign": 0,
    "no-restricted-syntax": 0,
    "prefer-const": 0,
    "simple-import-sort/imports": [
      1,
      {
        "groups": [
          // Packages `react` related packages come first.
          ["^react", "^@?\\w"],
          // Internal packages.
          ["^(@|components)(/.*|$)"],
          // Side effect imports.
          ["^\\u0000"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          // Style imports.
          ["^.+\\.?(css)$"]
        ]
      }
    ]
  },
  "overrides": [{
    "extends": "../.eslintrc.test.json",
    "files": ["./**/__tests__/**.test.ts"],
  }]
}