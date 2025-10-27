# Adding/Writing Tests

By default, any Typescript (`.ts`) files located within a `__tests__` folder are considered test files. This means that if `vitest` does not
detect any tests within that file, it will throw an error.  This also includes any subdirectories under a `__tests__` folder.

> [!WARNING] Test File Naming
> Right now any file ending with `.ts` or `.tsx` will be considered a test file. This is inconvenient, especially if you want to create a set of
> common utilities to be used only for tests. Such a file might (_READ: should_) not contain any tests, which will be considered by Vitest to be
> an error. 
>
> To remedy this, in the future, only files that end in `.test.ts` or `.test.tsx` will be considered test files. This will allow us to have regular
> Typescript files located within `__tests__` directories. This means you should use that naming convention instead when creating your test files.
>
> The current behaviour is retained for backwards compatibility since many Source modules' tests aren't written within `.test.ts` files. To see
> examples of how to use this new system you can refer to how the tests for the buildtools are written.

Simply write your tests within a file within a `__tests__` folder:

```ts
// curve/src/__tests__/index.ts
import { describe, expect, test } from 'vitest'; // You will need to import these functions, unlike in Jest

describe('This is a describe block', () => {
  test('This is a test', () => {
    expect(1).toEqual(1);
  });
});
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
});
```

For comprehensive instructions on how to write tests you can refer to the [Vitest website](https://vitest.dev/guide/#writing-tests).

## Describe Block Titles for functions

Vitest supports passing functions directly to `describe` blocks. You should use this syntax instead of using a string title where possible:
```ts
function foo() {}

// Don't do this
describe('foo', () => {});

// Do this instead!
describe(foo, () => {});
```

This is so that if you ever rename the function, the title of the describe block will change during your refactoring and there won't be a mismatch.

Of course, if you're not specifically testing a function, you can still use the normal string description:
```ts
describe('A bunch of tests that need to execute', () => {});
```

## Test Filtering

> [!INFO]
> More information on this entire section can be found [here](https://vitest.dev/guide/filtering.html#skipping-suites-and-tests);

While writing tests, you might find that you might want to focus on a single test or single group of tests. For this, `vitest` provides on its `test`, `it` and `describe` functions
a `.skip` and a `.only` property:

```ts
describe('Test1 and Test3 will run!', () => {
  test('Test1', () => {});
  test.skip('Test2', () => {});
  test('Test3', () => {});
});
```

You don't have to comment out your tests; simply use `.skip` to indicate that a test block should not be executed.

If for some reason you want to skip your tests based on some condition, `vitest` provides the `skipIf` property:

```ts
describe('Test1 and Test3 will run!', () => {
  test('Test1', () => {});
  test.skipIf(condition)('Test2', () => {});
  test('Test3', () => {});
});
```

`.only` is kind of the reverse of `.skip`. Tests that you use `.only` with will be the **only** tests that run in that file:

```ts
describe('Only Test 2 will run!', () => {
  test('Test1', () => {});
  test.only('Test2', () => {});
  test('Test3', () => {});
});
```

The main runner that runs unit tests on the CI/CD pipeline does not allow for `.only`. You can simulate this behaviour by running your tests with the
`--no-allow-only` flag.  This behaviour is intended to prevent you from causing only part of your tests to run.

> [!INFO] Linting
> There is an ESLint rule configured to warn you if you use focused tests (using `.only`). This is not an issue, so long as you remember
> to remove `.only` before pushing to the main repository.

Pushing with skipped tests however, is allowed. Do leave a comment explaining why the test is skipped:

```ts
// Test is skipped because there is an outstanding bug
test.skip('Test path resolution', () => {});
```

## Stubbing Tests

If you want to indicate that tests should be written for certain functionality in the future, you can use `.todo`:

```ts
// Needs to be implemented when the outstanding bug is fixed
test.todo('Test path resolution');
```

TODO tests still generate an entry in your test reports, but will be considered neither failed nor passed.

## Mocking

Mocking is a way to create "fake" versions of your code. For more information, look [here](https://vitest.dev/guide/mocking.html).

Vitest allows you to mock a variety of aspects of Javascript code. In particular, this section focuses on the details of mocking classes and
Javascript modules.

### Mocking Modules

Mocking modules should be done with the `vi.mock` utility:

::: code-group
```ts [index.test.ts]
import { foo } from './index';
import { expect, test, vi } from 'vitest';

vi.mock(import('./bar'), () => {
  return {
    bar: () => 1,
  };
});

test('foo returns 1', () => {
  expect(foo()).toEqual(1);
});
```
```ts [index.ts]
import { bar } from './bar';

export function foo() {
  return bar();
}
```

```ts [bar.ts]
export function bar() {
  return 0;
}

export function bar2() {
  return 2;
}
```
:::

Though `vi.mock` accepts a string path, you should always use the import expression syntax, since it will
allow Typescript to provide typing and ensure that the path refers to a module that exists.

```ts
// do this
vi.mock(import('./wherever'));

// and not this!
vi.mock('./wherever');
```

The second argument is a factory function that returns the mock implementation of the module. Note that Typescript
will likely report type errors since your mock implementation will likely omit a lot of the module's actual functionality.

In this case, it is fine to use an `as any` type assertion:

```ts
// We're only concerned with bar, so we're not
// providing an implementation for bar2,
// so Typescript will complain
vi.mock(import('./bar'), () => {
  return {
    bar: vi.fn(() => 1),
  } as any; // So we cast the error away
});
```

The [`vi.fn`](https://vitest.dev/api/vi.html#vi-fn) utility returns a function that you can customize to your needs.

Sometimes you might want to mock only a specific function while retaining the original functionality everywhere
else. For this case, the factory function is provided a function (as an argument) that will return the original module:

```ts
// You could also use 
// vi.importActual();
// but that's not necessary

vi.mock(import('./bar'), async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    bar: vi.fn(() => 1),
  };
});
```

> [!TIP] Spying
> For the above case, you can also use the `vi.spyOn` utility, which automatically replaces the
> specified property with a mock instance.
>
> ```ts
> import * as bar from './bar';
> 
> vi.spyOn(bar, 'bar').mockReturnValue(1);
> ```

### Mocking Classes

From version 4 onwards, Vitest allows classes to be mocked using `vi.fn`. However, you must explicitly use
a class or a function expression:

::: code-group
```ts [index.test.ts]
vi.mock(import('./index'), () => ({
  Foo: vi.fn(class {} as any),
  // or
  Foo: vi.fn(function () {}),
  // but NOT
  Foo: vi.fn(() => {}),
}));

// And you can perform assertions as usual
expect(Foo).toHaveBeenCalledOnce();
```

```ts [index.ts]
export class Foo {}
```
:::

### Mocking "Global" Properties

Since the bundles are intended to be executed in a browser environment, you might find that some functionality
isn't available in the testing environment:

```ts [sound/functions.ts]
// Example from the sound bundle
export function play(sound: Sound) {
  // AudioContext is a browser only feature
  const audioPlayer = new AudioContext();

  /* implementation details ... */
}
```

In this case, unit tests will not be able to run correctly because `AudioContext` is not defined in
the test environment. For example, the test below:

```ts [sound.test.ts]
import { expect, test } from 'vitest';
import { play, silence_sound } from '../functions';

test('play works', () => {
  const sound = silence_sound(10);
  expect(() => play(sound)).not.toThrow();
});
```
fails with the following error:

```sh
- Expected:
undefined

+ Received:
"ReferenceError: AudioContext is not defined"
```

Spying on `AudioContext` directly doesn't work either because the `global` object
doesn't have such a property defined:

```sh
FAIL   sound Bundle  src/__tests__/sound.test.ts [ src/__tests__/sound.test.ts ]
Error: The property "AudioContext" is not defined on the object.
 ❯ src/__tests__/sound.test.ts:6:4
      6| vi.spyOn(global, 'AudioContext').mockReturnValue(mockAudioContext as any);
       |    ^
      7| 
      8| // Object.defineProperty(global, 'AudioContext', {
```

To resolve this you can use [browser mode](./3-browser), but this might be very heavyweight, especially if you
don't need any of the interactive testing features like `render`.

Instead, use `Object.defineProperty` on the `global` object:

```ts
import { expect, test, vi } from 'vitest';
import { play, silence_sound } from '../functions';

Object.defineProperty(global, 'AudioContext', {
  value: vi.fn(),
  writable: true // use this if you want to spy on it later
});

test('play works', () => {
  const sound = silence_sound(10);
  expect(() => play(sound)).not.toThrow();
});
```