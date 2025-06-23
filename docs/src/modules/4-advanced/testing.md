---
order: 3
---
# Unit Testing

The testing library used by this repository is [`vitest`](https://vitest.dev).

> [!WARNING]
> Other Source Academy repositories use `jest` as their testing package. Although `vitest` has been designed as a drop in replacement for `jest`,
> there are subtle differences between the two. For example, `vi.spyOn` doesn't replace the implementation within the module while `jest.spyOn` does (See [here](https://vitest.dev/guide/mocking.html#mocking-pitfalls)).
> 
> Refer to [this page](https://vitest.dev/guide/migration.html#jest) for more differences between `jest` and `vitest`.

## Adding Tests

By default, any Typescript (`.ts`) files located within a `__tests__` folder are considered test files. This means that if `vitest` does not
detect any tests within that file, it will throw an error.  This also includes any subdirectories under a `__tests__` folder.

Simply write your tests within a `__tests__` folder:
```ts
// curve/src/__tests__/index.ts
import { describe, expect, test } from 'vitest'; // You will need to import these functions, unlike in Jest

describe('This is a describe block', () => {
  test('This is a test', () => {
    expect(1).toEqual(1);
  })
})
```

> [!NOTE]
> Test files should included by each bundle's `tsconfig.json`. The build tools will automatically filter out these files when emitting
> Javascript and Typescript declarations but will still conduct type checking for them.

Tests for tabs can also use the `.tsx` extension along with JSX syntax:
```tsx
// Curve/__tests__/index.tsx
import { expect, test } from 'vitest';
import curveTab from '..';

test('CurveTab', () => {
  expect(<CurveTab />).toMatchSnapshot();
})
```

## Running Tests
To run tests for a given bundle or tab, simply run either of the following commands within the directory:
```sh
yarn buildtools test .
yarn test # If your package.json has this script specified
```

By default, `vitest` will quit after running tests. If you wish to run the tests in watch mode, use the `--watch` parameter.

## Code Coverage
To see how much of your code has been covered by tests, simply run your tests with the\
`--coverage` parameter.

## Integration with Git Hooks
Any tests that you have written must be pass in order for you to push to the main repository, as well as for your pull requests to be merged.

> [!TIP]
> You can push to the branch while bypassing the Git hook by running:
> ```sh
> git push --no-verify
> ```
> However, the tests will still be run and must pass before your pull request can be merged. So, we recommend not using this option
> unless absolutely necessary.

## Custom Test Configuration
The default test configuration parameters are as follows:
```js
import { mergeConfig, defineProject } from 'vitest/config';
import rootConfig from '[repo root]/vitest.config.js'; // the config at the repo root

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Your Bundle or Your Tab',
      environment: 'jsdom', // Important, since all our bundles and tabs need to be able to run in the browser
      silent: 'passed-only',
      watch: false
    }
  })
)
```

::: details `vitest.config.js` vs `vitest.config.ts`
`vitest` actually supports having its config files being written in Typescript. The repository's `vitest` config files however
are sometimes not attached to any Typescript project. This confuses other tooling in the repository (like ESLint), so the files are
written in plain Javascript with a <nobr><code>// @ts-check</code></nobr> directive.

However, if your configuration doesn't need to import the root configuration, then you can write your config file in Typescript.
:::

Should you need to use a unique configuration, follow the steps below:
1. Create your own `vitest.config` at the root of your bundle/tab.
1. Add `vitest` as a dev dependency
1. Change the `test` script to `vitest --config ./vitest.config.js`

> [!TIP]
> If your bundle requires `js-slang/context`, `vitest` will not be able to run your tests unless you add the following block
> to your configuration:
> ```js
> import { defineConfig } from 'vitest/config';
> 
> defineConfig({
>   resolve: {
>     alias: [{
>       find: /^js-slang\/context/,
>       // You need to find the path to the mocked context module
>       replacement: `${repoRoot}/src/__mocks__/context.ts`
>     }]
>   },
>   test: {
>     // vitest configuration options
>   }
> })
> ```
