---
title: Overview
---
# Modules ESLint Plugin
`@sourceacademy/modules-lintplugin` provides the ability for developers to write their own custom linting rules for SA Modules.

For example, there is a rule that checks that the `defineTab` helper is being used to help export tabs.

The plugin can also be used to provide ESLint configurations.

## Building
Run `yarn build` to build the plugin. The plugin is bundled into a single `dist.js` file using `esbuild`, while its
types are compiled into the `dist` folder.

## Testing
Unit testing is provided by `vitest` with `globals: true`. This allows both the `@typescript-eslint` and `eslint` rule testers
to use the `describe` and `test` functions without having to set them manually as described in the [`eslint` documentation](https://eslint.org/docs/latest/integrate/nodejs-api#customizing-ruletester).
