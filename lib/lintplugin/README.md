# Source Academy Modules ESLint Plugin

An ESLint plugin designed to be used for the Source Academy Modules repository.

Run `yarn build` to build the plugin. The plugin is bundled into a single `dist.js` file, while its
types are compiled into the `dist` folder.

## Testing
Unit testing is provided by `vitest` with `globals: true`. This allows both the `@typescript-eslint` and `eslint` rule testers
to use the `describe` and `test` functions without having to set them manually as described in the [`eslint` documentation](https://eslint.org/docs/latest/integrate/nodejs-api#customizing-ruletester).