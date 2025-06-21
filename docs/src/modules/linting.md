# Code Formatting and Linting
Code linting is the process of conducting static analysis on code to detect potential runtime issues and enforce
stylistic conventions. Linting for the repository is provided by [ESLint](https://eslint.org).

> [!NOTE]
> Other Source Academy repositories also use `prettier` for code formatting. This functionality was
> removed from the Modules repository.

## Running ESLint
ESLint can be run on its own on your bundle/tab code by using either of the following commands:
```sh
yarn lint
yarn buildtools lint .
```

If you wish to run ESLint during the build process, you can instead use:
```sh
yarn build --lint
yarn buildtools build <bundle|tab> . --lint
```

## Disabling ESLint Rules
If, for whatever reason you need to disable a specific ESLint rule for your bundle/tab, you can use the `// eslint-disable` directive. Please provide a short explanation on why
the rule needs to be disabled, following the example provided below:
```tsx
import { Button } from '@blueprintjs/core';
// eslint-disable @typescript-eslint/no-var-requires This import doesn't work if written using ESM
const TextBox = require('Textbox').default
```

## Ignoring Files
By default, ESLint has been configured to not lint files in specific directories or matching specific patterns. You can see the ignore patterns in `eslint.config.js` under the section labelled "Global Ignores". Please
note that if any of your code files matche these ignore patterns, they will not be properly linted by ESLint.

## Integration with Git Hooks
Linting is run during the pre-push hook and also on pull-requests. Your code must not have any lint errors in order to be pushed to the
branch and can have neither errors nor warnings to be merged.
