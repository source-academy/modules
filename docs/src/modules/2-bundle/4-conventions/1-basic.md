# Basic Conventions

## 1. Cadet facing functions should not have default or rest parameters

The function signature below takes in two booleans, the second of which is optional. This is not supported for Module functions in Source, but is fine if your function
isn't being exposed to cadets.

```ts
// Don't expose this to cadets!
function configure_options(option_1: boolean, option_2: boolean = false) {
  // ...implementation
}

// or this
function concat_strings(...args: string[]) {
  return args.join(',');
}

// But default and rest parameters are okay for internal use
export function exposed_function() {
  configure_options(true);
  concat_strings('str1', 'str2');
}
```

::: details Integration with `js-slang`
Neither default nor rest parameters are currently supported due to an [issue](https://github.com/source-academy/js-slang/issues/1238) on the `js-slang` side.
:::

## 2. Cadet facing functions should not use array destructuring for parameters

Javascript allows us to destruct iterables directly within a function's parameters:

```ts
export function foo([x, y]: [string, string]) {
  return x;
}
```

There's nothing inherently wrong with this, but if cadets pass a non-iterable object into the function,
Javascript is going to throw a fairly mysterious error:

```sh
foo(0);

function foo([x, y]) {
            ^
TypeError: number 0 is not iterable (cannot read property Symbol(Symbol.iterator))
```

If instead the parameter isn't destructured, it gives you the chance to perform type checking:

```ts
export function foo(arr: [string, string]) {
  if (!Array.isArray(arr)) throw new Error();
  return arr[0];
}
```

More information about throwing errors and why this kind of type checking is important can be found [here](./3-errors#source-type-checking).

::: details What about Object Destructuring?
Javascript also supports object destructuring in parameters:
```js
function foo({ x, y }) {
  return x;
}
```

However, Javascript doesn't actually throw an error if you pass an invalid object into this function:
```js
function foo({ x, y }) {
  return x;
}

console.log(foo(0)); // prints undefined
```

If an invalid argument gets passed, no error is thrown and the destructured values just take on the value of `undefined` (which you might want to check for).
:::

## 3. If your bundle requires specific Source features, make sure to indicate it in the manifest

Consider the bundle function below:

```ts
export function sum(args: numbers[]) {
  return args.reduce((res, each) => res + each, 0);
}
```

It takes an an input an array of `number`s. However, arrays are only available in Source 3 onward. This means that you should indicate in your bundle's manifest:

```jsonc
{
  "requires": 3
}
```

to let `js-slang` know that your bundle can't be loaded with Source 1 and 2.

::: details Which data structure to use?
In the above example, the array can actually be replaced with a Source `List`:

```ts
import { head, tail } from 'js-slang/dist/stdlib/list';

export function sum(args: List) {
  let total = 0;
  while (!is_null(args)) {
    const value = head(args);
    if (typeof value !== number) {
      throw new Error('Expected a list of numbers!');
    }
    total += value;
    args = tail(args);
  }

  return total;
}
```

Lists are actually introduced in Source 1, which would make the above function compatible with Source 1 instead of requiring Source 3. If your bundle doesn't need
functionality specific to arrays, then consider using Source Lists instead.
:::

## 4. Semantic Versioning

[Semantic Versioning](https://semver.org) refers to a convention on how version numbers should be specified. In your bundle's `package.json`, a `version` field should
be specified:

```jsonc {3}
{
  "name": "@sourceacademy/bundle-bundle0",
  "version": "1.0.0"
}
```

This version number should follow the rules of semantic versioning. `js-slang` will use this version number to determine if it currently has the latest version of your bundle
compatible with its current version.

## 5. Making use of `js-slang/stdlib`

Bundles, where necessary, should use the implementations of libraries such as `list` or `stream` from the `js-slang` standard library:

```ts
import { is_pair } from 'js-slang/dist/stdlib/list';

export function is_sound(obj: unknown): obj is Sound {
  return (
    is_pair(x)
    && typeof get_wave(x) === 'function'
    && typeof get_duration(x) === 'number'
  );
}
```

These libraries get externalized and are then provided to bundles at runtime, so not only does this make your bundle size smaller, but it also
ensures that you are using the same version of the `stdlib` as the version being used by `js-slang` while running your bundle code.

::: details An extra copy of `list`?
Once again, if you've been around long enough, you might remember a time where bundles each had to provide their own copy of the `list` library.
This is no longer necessary.
:::
