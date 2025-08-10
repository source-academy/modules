---
title: Overview
---
# Modules ESLint Plugin

`@sourceacademy/lint-plugin` provides the ability for developers to write their own custom linting rules for SA Modules.

For example, there is a rule that checks that the `defineTab` helper is being used to help export tabs.

The plugin also provides several configurations that can be used and extended from for different purposes. For more information,
refer to the [configs](./3-config.md) section.

Each of the custom rules made available by this plugin has documentation that follows the typical ESLint rule format. You can find
their documentation [here](./2-rules.md).

## Building

Run `yarn build` to build the plugin. The plugin is bundled into a single `dist.js` file using `esbuild`. The types of this plugin have been "hardcoded"
into the root `index.d.ts` file.

::: details Why not just compile to Typescript Declaration Files?
The outward facing type interface of this plugin is really only concerned with the rule and config definitons. If we used the compiled output from Typescript,
we'd get all the implementation details included within the types for the plugin.

Instead (and also to save us the time of having to rollup the declaration files), we declare the rules and configs, but mask their internal types using
the ESLint provided types (`Rule.RuleModule` and `ESLint.ConfigData`).
:::

## Testing

Unit testing is provided by `vitest` with `globals: true`. This allows both the `@typescript-eslint` and `eslint` rule testers
to use the `describe` and `test` functions without having to set them manually as described in the [`eslint` documentation](https://eslint.org/docs/latest/integrate/nodejs-api#customizing-ruletester).
