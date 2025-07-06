# ESLint

The ESLint config file for this repository is fairly complex. The different configuration objects target different groups of files to apply different rules.
You can refer to [this](https://eslint.org/docs/latest/use/configure/configuration-files) page for more information on how ESLint processes these configuration objects.

Generally, there are two types of linting rules:
1. Repository only code (used for development of modules)
2. Module code (Code that is actually intended to be used in Source)

Linting rules for module code tend to be stricter as there are conventions that need to be followed to ensure that users of Source have a more unified experience.
There are also many features supported by Javascript/Typescript that aren't supported in Source.

ESLint does provide a configuration inspector which can be started using <nobr>`yarn lint:inspect`</nobr>. It provides more information on what rules are applied to which files
and also other information like what rules are considered deprecated.

## Configuration Conventions
Our linting configurations often inherit from recommended configurations provided by plugins. However, not all of the rules that are configured by these configurations make sense
for the repository at large. This requires that we manually override some of the settings provided by these configurations.

When changing a rule's configuration, leave a comment explaining what the original configuration for that rule was:

<<< ../../../eslint.config.js#Markdown

Where possible, also provide an explanation for why that rule has been configured as such:

<<< ../../../eslint.config.js#typescript {19}

<!--
## Linting Markdown Code Examples

Markdown gives us the ability to embed code blocks within regular text. ESLint is able to lint this code with the functionality provided by the `@eslint/markdown` package, which
provides a processor that makes these code blocks available to ESLint.

Because `typescript-eslint` requires a `tsconfig` to be able to lint any kind of Typescript code, it can't actually be used with any type-aware rules. Furthermore, code examples
are usually incomplete snippets of Typescript/Javascript, so a lot of the typical rules in use don't really apply to these. Thus, code examples have their own separate configurations.
-->

## Linting JSON Files
For the most part, there are only stylistic rules that need to be applied to JSON files. This is why this repository doesn't use the official `@eslint/json` package for linting JSON files.
Instead. the parser from `eslint-plugin-json` is used so that stylistic rules can be applied to the JSON files. This does mean that none of the rules from `@eslint/json` can be applied
directly.
