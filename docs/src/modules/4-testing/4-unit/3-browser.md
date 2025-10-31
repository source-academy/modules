# Browser Mode

Tabs have the ability to leverage `playwright` and `vitest`'s browser mode to ensure that the interactive features of the tab actually
behave like they should.

The default testing configuration for tabs has browser mode disabled. This is so that if your tab doesn't need the features that Playwright provides,
`vitest` won't need to spin up the Playwright instance.

## Setting up Browser Mode

Should you wish to enable browser mode, create a custom `vitest` configuration file for your tab with the `browser.enabled` option set to `true`:

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
});
```

You will also need to add (to your dev dependencies) other packages:

- `@vitest/browser-playwright`
- `vitest-browser-react`
- `playwright`

In the case of `playwright`, you might also have to run `playwright install chromium`.

If your system doesn't have the necessary dependencies for `playwright`'s install, you will have to run `playwright install chromium --with-deps` instead.

Now, the tests for your tab can be run in browser mode.

> [!INFO] Default Browser Instance
> By default, one `chromium` browser instance will be provided. This should be sufficient, but you can always
> add more instances if necessary.
>
> Then, you will also have to specify this instance when running the `playwright` installation command above.

## Writing Interactive Tests

Writing interactive tests is not very different from writing regular tests. Most of the time, the usual test and assertion functions will suffice.

> [!INFO]
> While writing your tests, you should use watch mode. This will allow `vitest` to open a browser and actually display what your tab looks like whilst
> being rendered during the test.

Use the `render` function provided `vitest-browser-react` to render your tab/component to a screen. Note that it should be awaited.
The returned value can then be interacted with:

```tsx
import { render } from 'vitest-browser-react';

test('Testing my component', async () => {
  const screen = await render(<MyComponent />);
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
>
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
  const component = await render(<Animation />);
  const finishScreen = component.getByTitle('finish');
  // Might fail because the assertion will execute before the animation finishes
  expect(finishScreen).toBeVisible();
});
```

Instead, `vitest` provides a special set of matchers that can be used to "retry" the assertion until it passes or when it times out:

```tsx
import { render } from 'vitest-browser-react';

test('An animation', async () => {
  const component = await render(<Animation />);
  const finishScreen = component.getByTitle('finish');

  await expect.poll(() => finishScreen).toBeVisible();
  // or use the shorthand
  await expect.element(finishScreen).toBeVisible();
});
```

## Animations with `requestAnimationFrame`

If you're using `requestAnimationFrame` to trigger animations, you can also test the behaviour of these animated components.

Firstly, add the following setup and teardown function calls to your code:

```ts
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});
```

Then you can use calls `vi.advanceTimersToNextFrame()` to simulate `requestAnimationFrame` being called:

```tsx
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
});

test('An animation', async () => {
  const component = await render(<Animation />);
  const finishScreen = component.getByTitle('finish');

  for (let i = 0; i < 160; i++) {
    // Each call advances "time" by 16ms
    vi.advanceTimersToNextFrame();
  }

  await expect.element(finishScreen).toBeVisible();
});
```

## Element Locators

In the above examples, you might have noticed that we can actually grab elements that are within the DOM and do things with them (like performing
assertions or clicking).

`vitest` provides several ways to "locate" an element helpfully called [locators](https://vitest.dev/guide/browser/locators.html).

While writing tabs, if we believe that a component will need to be interacted with during unit testing, we can use attributes like `title` to make it
easier to refer to these elements:

```tsx
export function Foo() {
  return <p title="important" />;
}

// Can then be referred to:
test('test0', async () => {
  const screen = await render(<Foo />);
  const p = screen.getByTitle('important');
  await expect.element(p).toBeVisible();
});
```

## Simulating User Input

You can simulate user input by using the `userEvent` utility from `vitest/browser`:

```tsx
export function Foo() {
  const [text, setText] = useState('');
  return <div>
    <input
      onChange={e => setText(e.target.value)}
      value={text}
    />
    <p>You said: {text}</p>
  </div>;
}

// In tests:
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

test('Changing text works', async () => {
  const screen = await render(<Foo />);
  await userEvent.keyboard('abcd');
  const element = screen.getByText('abcd');
  await expect.element(element).toBeVisible();
});
```

It can also simulate sustained keypresses, mouse inputs and a whole lot of [other things](https://testing-library.com/docs/user-event/keyboard/).
