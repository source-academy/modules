# Error Handling

As a continuation of the previous section, and important part of hiding a bundle's implementation details involves handling error conditions and errors
that could be thrown.

All objects thrown by `throw` statements should be a type that extends from `Error`:

```js
throw new Error('this is an error!'); // throw error objects
throw 'string';                       // don't throw anything else!
```

> [!INFO] ESLint's only-throw-error
>
> There is an ESLint rule configured to highlight whenever the object you are throwing is not a valid error. There
> shouldn't be a case where you are throwing a non-error object, but if ESLint doesn't properly recognize that the
> type you are throwing is an error, you can configure ESLint to ignore that specific type.

## The `name` Property on Functions

Specific to error handling, thrown errors should contain a reference to the calling function's name (using the `name` property):

```ts
export function make_sound(wave: Wave, duration: number): Sound {
  if (duration < 0) {
    throw new Error(`${make_sound.name}: Sound duration must be greater than or equal to 0`);
  }

  return pair((t: number) => (t >= duration ? 0 : wave(t)), duration);
}
```

This helps prevent the stack trace from going deeper into internal bundle implementations, which would only serve to confuse a cadet and break abstractions.

If the error is thrown from a function that's only meant for internal use, then that function should take a `func_name` string parameter instead:

```ts
// throwIfNotRune isn't exported, it is supposed to be called
// from functions that are
function throwIfNotRune(func_name: string, obj: unknown): asserts obj is Rune {
  if (!(rune instanceof Rune)) {
    throw new Error(`${func_name} expects a rune as argument.`);
  }
}

// like show
export function show(rune: Rune) {
  throwIfNotRune(show.name, rune);
  drawnRunes.push(new NormalRune(rune));
  return rune;
}

// and anaglyph
export function anaglyph(rune: Rune) {
  throwIfNotRune(anaglyph.name, rune);
  drawnRunes.push(new AnaglyphRune(rune));
  return rune;
}
```

> [!TIP]
> The `asserts obj is Rune` syntax is known as a _type guard_, a feature supported by Typescript to help assist the compiler in type narrowing.
> More information can be found [here](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
>
> Where possible, you should make use of type guards to help increase the type safety of your bundle code

Then, the error can be thrown with the correct function name. Otherwise, cadets would see that the error originated from `throwIfNotRune`, which is not a function
that is visible to them. Many other functions might rely on `throwIfNotRune`. If they were all called in the same program, it doesn't tell the cadet which function the error was thrown from
(was it `show`? or `anaglyph`? or something else?)

An important use for error handling is when it comes to validating types. More information about type checking can be found in the [next](./4-types) section.

> [!WARNING] Undefined Name Property
>
> It's possible to create functions without names using anonymous expressions:
>
> ```ts
> function getFunc(value: string) {
>   return () => value;
> }
>
> export const getFoo = getFunc('foo');
> 
> // getFoo.name is undefined!
> console.log(getFoo.name);
> ```
>
> A common case (especially if you are using type maps) is using an expression when defining a class function. This causes an anonymous function to be assigned to that property:
>
> ```ts
> class Functions {
>   static bar = () => 'bar';
> }
> 
> // the name is also undefined!
> console.log(Functions.bar.name);
> ```
>
> In such a case, you should take care to define the `name` property manually (at least on the exported version):
>
> ```ts
> function getFunc(value: string, func_name: string) {
>   const func = () => value;
>   Object.defineProperty(func, 'name', { value: func_name });
>   return func;
> }
>
> export const getFoo = getFunc('foo', 'foo');
> 
> // Now correctly prints foo!
> console.log(getFoo.name);
> ```

## Runtime Errors

Runtime errors that are bubbled all the way through to cadet code should make use of the error types exported by `js-slang`. The main error type to use
is the `GeneralRuntimeError`:

```ts twoslash
// @noErrors: 2300 2307
// ---cut---
// You can import it directly from js-slang
import { GeneralRuntimeError } from 'js-slang/dist/errors/base';

// or from the modules-lib
import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';

export function foo() {
  throw new GeneralRuntimeError(`${foo.name} encountered an error!`);
}
```

`GeneralRuntimeError` is a non-specific runtime error type. If you have runtime errors that are supposed to be of a certain category,
you can always create your own error type by extending from `RuntimeSourceError`:

```ts twoslash
import { RuntimeSourceError } from 'js-slang/dist/errors/base'; // also exported from modules-lib

class FooRuntimeError extends RuntimeSourceError {
  public override explain(): string {
    return 'this is a foo error!';
  }
}
```

## Internal Errors

For errors that are thrown at runtime but are a result of an invalid or (theoretically) unreachable state, you can throw `InternalRuntimeError`s:

```ts twoslash
import { InternalRuntimeError } from '@sourceacademy/modules-lib/errors';

export function get_zero() {
  return 0;
}

export function error_if_not_zero() {
  if (get_zero() !== 0) {
    // Should never happen!
    throw new InternalRuntimeError('Something went wrong with get_zero!');
  }
}
```

In cases like the one above where you are trying to validate a condition, you can use the `assert` function provided by `js-slang`:

```ts twoslash
import assert from 'js-slang/dist/utils/assert';

export function get_zero() {
  return 0;
}

export function error_if_not_zero() {
  const x: unknown = get_zero();
  assert(x === 0, 'Something went wrong with get_zero!');

  return x;
  //     ^?
}
```

If the condition is false, an `AssertionError` (which is a subclass of `InternalRuntimeError`) is thrown with the provided message.
`assert` is a type guard, so you can make use of it to type check `unknown` parameters and variables.

> [!WARNING]
>
> The `assert` function exported by `js-slang` is different from the one exported from NodeJS. Take care to use the one
> exported from `js-slang`.

Just like `GeneralRuntimeError`, `InternalRuntimeError` can be extended should you wish to create a specific class to represent
a specific type of internal error.
