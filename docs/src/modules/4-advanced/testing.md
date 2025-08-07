---
order: 3
---
# Unit Testing

The testing library used by this repository is [`vitest`](https://vitest.dev).

> [!IMPORTANT]
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
> Test files should included by each bundle's or tab's `tsconfig.json`. The build tools will automatically filter out these files when emitting
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

You can also use `--update` to update snapshots and `--coverage` to run the V8 coverage reporter.

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

You don't need to create a custom `vitest.config.js` for your bundle or tab. If the configuration file is absent, the default testing configuration
options will be applied.

::: details `vitest.config.js` vs `vitest.config.ts`
`vitest` actually supports having its config files being written in Typescript. The repository's `vitest` config files however
are sometimes not attached to any Typescript project. This confuses other tooling in the repository (like ESLint), so the files are
written in plain Javascript with a <nobr><code>// @ts-check</code></nobr> directive.
:::

> [!WARNING] Dependency Optimization Error
> You may find that when your tests run on your local machine the following warning (or something similar) may appear:
> ```sh
> [vite] (client) ✨ new dependencies optimized: react/jsx-dev-runtime  
> [vite] (client) ✨ optimized dependencies changed. reloading  
> [vitest] Vite unexpectedly reloaded a test. This may cause tests to fail, lead to flaky behaviour or duplicated test runs.  
> For a stable experience, please add mentioned dependencies to your config's `optimizeDeps.include` field manually.  
> ```
> If this warning appears when you run your tests on the machine, you may find that your tests may still pass on the local machine, but
> fail on the CI pipeline.
>
> This is because you have a dependency that Vite can only detect at runtime and so has to run its internal transforms twice. This causes
> Vitest to fail, since the original import would have failed. To fix this, you should create your own `vitest.config.js` and add those
> dependencies to `optimizeDeps`:
> ```js
> export default defineProject({
>   optimizeDeps: {
>     include: ['react/jsx-dev-runtime'] 
>   },
>   test: {
>     name: 'Root Project'
>   }
> })
> ```
> For more information, refer to the [Vite](https://vite.dev/config/dep-optimization-options.html#optimizedeps-include) documentation.

Should you need to use a unique configuration, simply create your own `vitest.config.js` at the root of your bundle/tab.
The configuration options in your `vitest.config.js` will be used **in addition** to the default options, so it is not necessary
to redefine every single option in your configuration file.

You should use the `defineProject` helper instead of the `defineConfig` helper:
```js [vitest.config.js]
// @ts-check
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    root: import.meta.dirname, // Remember to configure this correctly
    name: 'My Bundle'
  }
})
```

There is no need to use `mergeConfig` to merge your configuration with the root configurations. When the build tools run `vitest`,
the merging is performed automatically.

## Browser Mode
Tabs have the ability to leverage `playwright` and `vitest`'s browser mode to ensure that the interactive features of the tab actually
behave like they should.

The default testing configuration for tabs has browser mode disabled. This is so that if your tab doesn't need the features that Playwright provides,
`vitest` won't need to spin up the Playwright instance.

### Setting up Browser Mode
Should you wish to enable browser mode, create a custom `vitest` configuration file for your tab with the `browswer.enabled` option set to `true`:

```js {9}
// @ts-check
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    root: import.meta.dirname,
    name: 'My Tab',
    browser: {
      enabled: true
    }
  }
})
```

Now, the tests for your tab will be run in browser mode.

> [!INFO] Default Browser Instance
> By default, one `chromium` browser instance will be provided. This should be sufficient, but you can always
> add more instances if necessary.

### Writing Interactive Tests
Writing interactive tests is not very different from writing regular tests. Most of the time, the usual test and assertion functions will suffice.

> [!INFO]
> While writing your tests, you should use watch mode. This will allow `vitest` to open a browser and actually display what your tab looks like whilst
> being rendered during the test.

Use the `render` function provided `vitest-browser-react` to render your tab/component to a screen. The returned component can then be interacted with:
```tsx
import { render } from 'vitest-browser-react';

test('Testing my component', () => {
  const screen = render(<MyComponent />);
  const button = screen.getByRole('button');

  await button.click();

  expect().somethingToHaveHappened();
});
```
`vitest` also provides [a different set](https://vitest.dev/guide/browser/assertion-api.html) of matchers that you can use specifically with browser elements.

> [!TIP]
> `vitest-browser-react` also provides a `cleanup` function that can be used after each test. You don't _technically_ need to use it, but
> you may find that if you have multiple tests in the same file that behaviour might be inconsistent.
>
> You can use it with `afterEach` from `vitest`:
> ```ts
> import { afterEach } from 'vitest';
> import { cleanup } from 'vitest-browser-react';
>
> afterEach(() => { cleanup(); });
> ```

### `expect.poll` and `expect.element`
Sometimes, visual elements take a while to finish or an element might take a while to load. If you just directly used an assertion, the assertion
might fail because the element hasn't displayed yet:

```tsx
import { render } from 'vitest-browser-react';

test('An animation', async () => {
  const component = render(<Animation />);
  const finishScreen = component.getByTitle('finish');
  // Might fail because the assertion will execute before the animation finishes
  expect(finishScreen).toBeVisible(); 
});
```

Instead, `vitest` provides a special set of matchers that can be used to "retry" the assertion until it passes or when it times out:
```tsx
import { render } from 'vitest-browser-react';

test('An animation', async () => {
  const component = render(<Animation />);
  const finishScreen = component.getByTitle('finish');

  await expect.poll(() => finishScreen).toBeVisible(); 
  // or use the shorthand
  await expect.element(finishScreen).toBeVisible();
});
```

### Animations with `requestAnimationFrame`
If you're using `requestAnimationFrame` to trigger animations, you can also test the behaviour of these animated components.

Firstly, add the following setup and teardown function calls to your code:
```ts
import { beforeEach, afterEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
})

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
})
```

Then you can use calls `vi.advanceTimersToNextFrame()` to simulate `requestAnimationFrame` being called:

```tsx
import { beforeEach, afterEach, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';

beforeEach(() => {
  vi.useFakeTimers();
})

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
})

test('An animation', async () => {
  const component = render(<Animation />);
  const finishScreen = component.getByTitle('finish');

  for (let i = 0; i < 160; i++) {
    // Each call advances "time" by 16ms
    vi.advanceTimersToNextFrame();
  }

  await expect.element(finishScreen).toBeVisible();
});

```
