# Mocking

Mocking is a way to create "fake" versions of your code. For more information, look [here](https://vitest.dev/guide/mocking.html).

Mocks are isolated to each test file, meaning that a call to `vi.mock` etc. will only apply those mocks to the tests located in the **same**
file as the call.

## Mocking Modules

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

Though `vi.mock` accepts a string path, you should always use the import expression syntax where possible,
since it will allow Typescript to provide typing and ensure that the path refers to a module that exists. Also, if you
relocate the file you're importing from or the test file itself, the path will automatically get rewritten
(if you're using an editor like VSCode).

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
>
> Spying however, doesn't replace the underlying implementation. You must still call `mockImplementation` or any
> of the other methods to change the behaviour of the spied function.

## Mocking Classes

From version 4 onwards, Vitest allows classes to be mocked using `vi.fn`. However, you must explicitly use
a class or a function expression:

::: code-group

```ts [index.test.ts]
vi.mock(import('./index'), () => ({
  // class expression
  Foo: vi.fn(class {} as any),
  // or function expression
  Foo: vi.fn(function () {}),
  // but NOT arrow function
  Foo: vi.fn(() => {}),
}));

// And you can perform assertions as usual
expect(Foo).toHaveBeenCalledOnce();
```

```ts [index.ts]
export class Foo {}
```
:::

## Mocking "Global" Properties

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
```

To resolve this you could use [browser mode](./4-browser), but this might be very heavyweight, especially if you
don't need any of the interactive testing features like `render`.

Instead, use `vi.stubGlobal`:

```ts
import { expect, test, vi } from 'vitest';
import { play, silence_sound } from '../functions';

vi.stubGlobal('AudioContext', vi.fn());

test('play works', () => {
  const sound = silence_sound(10);
  expect(() => play(sound)).not.toThrow();
});
```

## Mocking 'Function-Like's and Mocking Return Values

There are a variety of things in Typescript that behave like functions you can call (e.g. class constructors, getters). Often times,
you will find yourself needing to mock the return value of these functions only once for a specific test:

::: code-group
```ts [src/__tests__/foo.test.ts]
import { expect, test, vi } from 'vitest';
import * as foo from './foo';
import * as bar from './bar';

test('mocked foo', () => {
  vi.spyOn(bar, 'bar').mockReturnValueOnce(0);
  expect(foo.foo(0)).toEqual(0);
});

test('regular foo', () => {
  expect(foo.foo(0)).toEqual(1);
});
```

```ts [src/foo.ts]
import { bar } from './bar';

export function foo(x: number) {
  if (!doSomeOtherthings()) {
    return 100;
  }

  return bar() + x;
}
```

```ts [src/bar.ts]
export function bar() {
  return 1;
}
```
:::

Now consider, what happens if in `foo`, `doSomeOtherThings` returns `false`? `bar` never gets called, so its mock implementation
never gets cleared. This means that when the second test executes, `bar`'s return value is still mocked as 0, and this will cause
the second test to fail:

```ts [src/__tests__/foo.test.ts]
import { expect, test, vi } from 'vitest';
import * as foo from './foo';
import * as bar from './bar';

test('mocked foo', () => {
  // bar never gets called during this test
  vi.spyOn(bar, 'bar').mockReturnValueOnce(0);
  expect(foo.foo(0)).toEqual(0);
});

// so it still has a 'mocked' return value of 0 here
test('regular foo', () => {
  expect(foo.foo(0)).toEqual(1);
});
```

Of course, `doSomeOtherThings` should be also have an appropriate mocked value, but what if its implementation details change, or you
simply forget to do the mock?

This is why whenever `mockReturnValueOnce` (or any of the mock once methods) are called, you should also have an assertion checking
that the function you are calling was indeed called:

```ts [src/__tests__/foo.test.ts]
import { expect, test, vi } from 'vitest';
import * as foo from './foo';
import * as bar from './bar';

test('mocked foo', () => {
  vi.spyOn(bar, 'bar').mockReturnValueOnce(0);
  expect(foo.foo(0)).toEqual(0);

  // Assert that bar was called so that if it was not the
  // test fails and might at least help explain why subsequent
  // tests also fail
  expect(bar.bar).toHaveBeenCalledOnce();

});

test('regular foo', () => {
  expect(foo.foo(0)).toEqual(1);
});
```

Of course if you called `mockReturnValueOnce` more than once, you should assert that your function was called at least that many times:

```ts [src/__tests__/foo.test.ts]
import { expect, test, vi } from 'vitest';
import * as foo from './foo';
import * as bar from './bar';

test('mocked foo', () => {
  vi.spyOn(bar, 'bar')
    .mockReturnValueOnce(0)
    // .mockRejectedValueOnce(new Error()) or even with mockRejectedValue!
    .mockReturnValueOnce(1);

  expect(foo.foo(0)).toEqual(0);

  expect(bar.bar).toHaveBeenCalledTimes(2);
});

test('regular foo', () => {
  expect(foo.foo(0)).toEqual(1);
});
```

The alternative would be to clear all your mocks after every test:

```ts [src/__tests__/foo.test.ts]
import { afterEach, expect, test, vi } from 'vitest';
import * as foo from './foo';
import * as bar from './bar';

const mockedBar = vi.spyOn(bar, 'bar');

afterEach(() => {
  mockedBar.mockClear();
});

test('mocked foo', () => {
  mockedBar
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(1);

  expect(foo.foo(0)).toEqual(0);
});

test('regular foo', () => {
  expect(foo.foo(0)).toEqual(1);
});
```

but if you are going to be mocking the return value of a function three times specifically, you probably wanted to make
sure that it was called three times anyway.

## Auto-Mocking

Sometimes, because mocks are isolated to each test file, you might find yourself writing the same mock implementation multiple times.
This is of course bad in terms of DRY, but also increases the fragility of your mock implementations: a change in one file might be
missed and not reflected in another. There are several ways around this problem.

### Summary of Methods

<table>
  <thead>
    <tr>
      <th></th>
      <th>Local Modules via <code>vi.mock</code></th>
      <th>Node Modules via <code>vi.mock</code></th>
      <th><code>vi.spyOn</code></th>
      <th><code>vi.stubGlobal</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="#1-use-a-utility-file">
        Utility File
        </a>
      </td>
      <td>❌</td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>
        <a href="#2-use-a-setup-file">
          Setup File
        </a>
      </td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>
        <a href="#3-use-an-automock">
          Automock
        </a>
      </td>
      <td>✅</td>
      <td>❌</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

### 1. Use a utility file

Recall that `.ts` files located within `__tests__` folders are not included in compilation and are not expected to contain
tests. We can write our mock implementations in them and then reuse those implementations by importing from them.

For example:

```dirtree
name: src
children:
- name: __tests__
  children:
  - name: utils.ts
    comment: Will not be checked for unit tests!
  - functions.test.ts
- functions.ts
```

Then we can write our mock as part of a function in the `utils.ts` file:

::: code-group
```ts [__tests__/utils.ts]
import { vi } from 'vitest';
import * as funcs from '../functions';

export function mockFoo() {
  vi.spyOn(funcs, 'foo').mockReturnValueOnce(1);
}
```

```ts [__tests__/functions.test.ts]
import { beforeEach, expect, test } from 'vitest';
import { mockFoo } from './utils';
import { foo } from '../functions';

beforeEach(() => {
  mockFoo(); // Mock foo before each test
});

test('a test', () => {
  expect(foo(5)).toEqual(1);
});
```

```ts [functions.ts]
export function foo(x: number) {
  return x;
}
```
:::

Because of the way that `vi.mock` is handled by Vitest, this method **cannot** be used for mocks that rely on that.

### 2. Use a setup file

Follow the same procedure outlined [here](./1-general#custom-test-configuration) to create your own custom configuration file. Then,
configure the [`setupFiles`](https://vitest.dev/config/setupfiles.html) option.

Setup files let you run code before each test file is executed, so you can use them to make calls to `vi.mock`, `vi.spyOn` and `vi.stubGlobal`
to set up your mocks before all your tests.

Example:

```ts [vitest.setup.ts]
import fs from 'fs/promises';
import { vi } from 'vitest';

// Mock the 'path' module to always refer to the posix library
// even if we're running on windows
vi.mock(import('path'), async importOriginal => {
  const { posix } = await importOriginal();
  return {
    default: posix
  };
});

// Mock fs.writeFile so that we never actually write to the file system
// no matter the test
vi.spyOn(fs, 'writeFile').mockImplementation(() => Promise.resolve(true));
```

### 3. Use an 'automock'

> [!WARNING]
> Automocks only work for mocking local modules. It can't be used to mock "node" modules (i.e modules you add using Yarn).

Consider the following folder structure:

```dirtree
name: src
children:
- functions.ts
- more.ts
- name: __tests__
  children:
  - functions.test.ts
  - more.test.ts
```

::: code-group

```ts [functions.test.ts]
import { expect, test, vi } from 'vitest';
import { foo } from '../functions';

vi.mock(import('../functions'), () => ({
  foo: () => 1
}));

test('a test', () => {
  expect(foo(10)).toEqual(1);
});
```

```ts [more.test.ts]
import { expect, test, vi } from 'vitest';
import { bar } from '../more';

vi.mock(import('../functions'), () => ({
  foo: () => 1
}));

test('another test', () => {
  expect(bar(10)).toEqual(2);
});
```
```ts [functions.ts]
export function foo(x: number) {
  // ... does other things
  return x;
}
```

```ts [more.ts]
import { foo } from './functions';

export function bar(x: number) {
  return foo(x) + 1;
}
```
:::

Notice that the call to `vi.mock` `functions.ts` happens twice and is identical. By creating a `__mocks__` folder that shadows
the directory structure of the original directory, we can create the mock implementations we need:

```dirtree
name: src
children:
- name: __mocks__
  comment: Mirrors the structure of src
  children:
  - functions.ts
  - more.ts
- functions.ts
- more.ts
- name: __tests__
  children:
  - functions.test.ts
  - more.test.ts
```

Inside `__mocks__/functions.ts`, we write our mock implementation:
```ts [__mocks__/functions.ts]
export function foo() {
  return 1;
}
```

Then we no longer need to provide the implementation directly in our tests:

::: code-group

```ts [functions.test.ts]
import { expect, test, vi } from 'vitest';
import { foo } from '../functions';

vi.mock(import('../functions')); // No factory function!

test('a test', () => {
  expect(foo(10)).toEqual(1);
});
```

```ts [more.test.ts]
import { expect, test, vi } from 'vitest';
import { bar } from '../more';

vi.mock(import('../functions')); // No factory function!

test('another test', () => {
  expect(bar(10)).toEqual(2);
});
```
:::

Vitest will automatically load the implementation provided by the `__mocks__` folder.

> [!INFO] tsconfig Configuration
> Similar to how files in `__tests__` folders need to be included in `tsconfig.json` to enable typechecking,
> `__mocks__` folders should also be included (or rather you should not configure them to be explicitly included or excluded).
>
> The buildtools will automatically filter them out when running Typescript compilation.

This approach can be combined with the setup file approach above:

```ts [vitest.setup.ts]
import { vi } from 'vitest';

vi.mock(import('./src/functions'));
```

Then the implementation inside the `__mocks__` folder gets automatically loaded for every test file.
