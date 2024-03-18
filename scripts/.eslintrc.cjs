module.exports = {
	"extends": "../.eslintrc.base.cjs",
	"ignorePatterns": ["**/__tests__/**", "**/__mocks__/**", "templates/templates/**", "*.*js"],
	"plugins": ["import", "@typescript-eslint"],
	"parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
	},
	"rules": {
		"array-callback-return": 0,
		"arrow-parens": 0,
		"consistent-return": 0,
		"func-style": 0,
		"import/extensions": [2, "never"],
		"import/no-duplicates": [1, { 'prefer-inline': true }],
		"no-shadow": 0,
		"no-unused-vars": 0,
		"quotes": [1, 'single'],
		"semi": 0,
		"@typescript-eslint/no-unused-vars": [1, { argsIgnorePattern: '^_' }]
	},
};
