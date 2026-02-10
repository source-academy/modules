# Basic Conventions

This section contains some conventions to follow when writing your bundle.

[[toc]]

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

## 2. Cadet facing functions should not use destructuring for parameters

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

Javascript also supports object destructuring in parameters:

```ts
interface BarParams {
  x: string;
  y: string;
}

function bar({ x, y }: BarParams) {
  return x;
}
```

However, Javascript doesn't actually throw an error if you pass an invalid object into the function:

```ts
function bar({ x, y }: BarParams) {
  return x;
}

console.log(bar(0)); // prints undefined
```

If an invalid argument gets passed, no error is thrown and the destructured values just take on the value of `undefined` (which you might want to check for).

However, if you use nested destructuring, Javascript _will_ throw an error:

```ts
interface Bar2Params {
  x: {
    a: string;
    b: string;
  };
}

function bar2({ x: { a, b } }: Bar2Params) {
  return a;
}

console.log(bar2(0));
```

The call to `bar2` causes an error like the one below:

```sh
Uncaught TypeError: Cannot read properties of undefined (reading 'a')
  at bar2 (<anonymous>:1:21)
  at <anonymous>:1:1
```

because of course, when `bar2` is called with `0`, `x` becomes `undefined` and trying to destructure `undefined` causes the `TypeError`.

If instead the parameter isn't destructured, it gives you the chance to perform type checking:

```ts
export function foo(arr: [string, string]) {
  if (!Array.isArray(arr)) throw new Error();
  return arr[0];
}

export function bar2(obj: Bar2Params) {
  if (typeof obj !== 'object' || !('x' in obj)) {
    // throw an error....
  }

  return obj.x;
}
```

> [!IMPORTANT]
> More information about throwing errors and why this kind of type checking is important can be found [here](./3-errors#source-type-checking).

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

## 5. Making use of `js-slang`

Bundles, where necessary, should use the implementations from `js-slang`:

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

These imports get externalized and are then provided to bundles at runtime, so not only does this make your bundle size smaller, but it also
ensures that you are using the same implementations as those being used by `js-slang` while running your bundle code.

Note that not every export from `js-slang` is currently supported. Below is the list of paths you can import from:

- `js-slang`
- `js-slang/context`
- `js-slang/dist/stdlib`
- `js-slang/dist/types`
- `js-slang/dist/utils/assert`
- `js-slang/dist/utils/stringify`
- `js-slang/dist/parser/parser`
- `js-slang/dist/cse-machine/interpreter`

## 6. Cadet Facing Type Guard Conventions

A [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) is a function that checks if the provided object has the desired type.
In Typescript, there are two kinds of type guards.  Cadet facing type guards should favour the boolean returning form and should begin with the
`is` prefix. Also, the parameter the type guard validates should be of type `unknown`.

Anywhere you use a boolean check followed by a type assertion:

```ts
// Simple boolean type guard
export function is_sound(obj: unknown): boolean {
  return obj instanceof Sound;
}

function play(obj: Sound) {
  // Simple boolean check
  if (!is_sound(obj)) return false;

  // followed by type assertion, since obj is still of type unknown
  const sound = obj as Sound;
  // ...implementatation details
}
```

you should replace with a type guard:

```ts
// Typescript boolean Type Guard
export function is_sound(obj: unknown): obj is Sound {
  return obj instanceof Sound;
}

function play(obj: Sound) {
  // Check using a type guard
  if (!is_sound(obj)) return false;

  // Type assertion is no longer required. Typescript knows that obj
  // is a Sound here

  // ...implementatation details
}
```

Note that for simple checks (like `instanceof`), Typescript (later versions) is able to automatically infer when you are writing a type guard,
meaning that explicitly typing your type guard may be unnecessary.

However, if the checks you need to perform are complex, Typescript might
only be able to narrow the return type of your type guard to `boolean`. In such a case you will have to write the return type explicitly.

> [!TIP] Type Guards in Documentation
> Type guards have a specific syntax for their return types (e.g. `value is null`) that isn't Source compliant.
> These types get replaced with `boolean` when the documentation is generated, so you don't have to worry
> about type guard types appearing in your documentation.
