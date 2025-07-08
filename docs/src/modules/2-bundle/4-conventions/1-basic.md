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
  return args.join(',')
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

## 2. If your bundle requires specific Source features, make sure to indicate it in the manifest
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

## 3. Making use of `js-slang/stdlib`
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
