---
title: Type Safety
outline: [2, 3]
---

# Runtime Type Safety in Source

Though bundles are written in Typescript, Source itself (except for the Typed Variant) does not support anything beyond rudimentary type checking. This means that it can determine that an expression
like `1 - "string"` is badly typed, but it can't type check more complex programs like the one below, especially when bundle functions are involved:

```ts
import { show } from 'rune';

// Error: show expects a rune!
show(1);
```

::: details Type Maps
Source is moving toward enabling compile-time (or at least pre-execution since Source programs don't really have a "compilation" step) type checking for Source Modules using a feature known as [type maps](../7-type_map).
:::

The above call to `show` **won't** a throw compile-time error. Instead, the error is thrown at runtime by bundle code or even in tab code. This is the case even if the function has been annotated with Typescript types.

In the case of `show`, if no runtime type-checking was performed, no error would be thrown when `show` is called. The error only manifests itself when the Rune tab is displayed:

![](./rune-error.png)

Since cadets interact with the bundle entirely through its exported functions, checking the runtime types of passed parameters is the main way this kind of type checking needs to be done.
For example, by checking if the passed parameter is indeed a `Rune` before passing it on to other `rune` bundle functions, we make error tracing a lot simpler for cadets.
This lets us highlight that the error occurred with `show`.

::: details Use the `unknown` or `any` types?
In Typescript, the `any` and `unknown` types represent an object of an unknown type. More information can be found [here](https://www.typescriptlang.org/docs/handbook/type-compatibility.html#any-unknown-object-void-undefined-null-and-never-assignability). This is where type guards really shine, as they allow the compiler to "narrow" the object's type from being anything down to a specific type. In the case of
`show`, it would work like this:

```ts
export function show(rune: unknown) {
  // Compiler only knows that rune has type unknown
  throwIfNotRune(show.name, rune);

  // Compiler is able to know that rune here has type Rune!
  drawnRunes.push(new NormalRune(rune));
  return rune;
}
```

If we're expecting cadets to be able to pass any type of object in, why not use `unknown` in all these places?

Currently, bundle documentation for cadets relies on these type annotations being present and properly typed. If everything were typed as `unknown`, that's
all cadets would see.

As the typing system is improved, we may be able to use one set of typing for cadets and another for internal implementation.

In effect, all bundle functions really look like this:

```ts
// Typescript style function overloads
export function show(rune: Rune): Rune;
export function show(rune: unknown) {
  throwIfNotRune(show.name, rune);
  drawnRunes.push(new NormalRune(rune));
  return rune;
}
```
:::

Errors related to type checking the values passed in as parameters should make use of the provided error types to ensure that error messages remain consistent
across bundles. The following sections discuss how to use the validation functions and errors provided by `modules-lib`.

> [!WARNING] instanceof not working
>
> If the type you are checking against is a class that's intended to be passed between tabs and bundles, you might find that
> `instanceof` checks always return `false`. Refer to [this issue](../../5-advanced/misc#instanceof-will-not-work-at-runtime) for more details.

## `InvalidParameterTypeError`

When throwing errors related to type checking, you should throw an `InvalidParameterTypeError`, which can be imported from the `modules-lib`:

```ts twoslash
type Sound = [(t: number) => number, number];
declare function is_sound(obj: unknown): obj is Sound;
// ---cut---
import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';

export function play(value: unknown): asserts value is Sound {
  if (!is_sound(value)) {
    throw new InvalidParameterTypeError('Sound', value, play.name);

    // you can provide the name of the parameter too!
    throw new InvalidParameterTypeError('Sound', value, play.name, 'value');
  }

  // ...implementation
}
```

The parameters of the constructor for `InvalidParameterTypeError` are as follows:
1. String representation of the expected type
2. Actual value passed in by the user
3. _Optional_: The name of the function that the error was thrown from (see [here](./3-errors) for more information)
4. _Optional_: The name of the parameter that is being validated

## Number Related Errors

Numbers in Javascript and Typescript are stored as floats, but most often we want to deal only with integers. Also, we may want to check that a
number is greater than a given minimum, less than a given maximum, or both.

`modules-lib` provides two functions and a dedicated error type for this purpose:

### `isNumberWithinRange`

The [`isNumberWithinRange`](../../../lib/modules-lib/Utilities#isnumberwithinrange) function checks that a given value is indeed a `number` and that it falls within the specified parameters. You can use it
to validate that the given number is an integer within a given range:

```ts twoslash
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';

function foo(val: unknown) {
  if (!isNumberWithinRange(val, 0, 2)) {
    throw new InvalidNumberParameterError(val, { min: 0, max: 2 }, foo.name);
  }
}

foo(1.5); // Error: foo expected integer between 0 and 2, got 1.5.
foo(-1);  // Error: foo expected integer between 0 and 2, got -1.
```

You can not specify a maximum, in which case only the lower bound is validated. Similarly, not providing a minimum means that only an upper bound
is validated:

```ts twoslash
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
// ---cut---
function isGreaterThan0(val: unknown) {
  if (!isNumberWithinRange(val, 1)) {
    throw new InvalidNumberParameterError(val, { min: 1 }, isGreaterThan0.name);
  }
}

isGreaterThan0(0); // Error: isGreaterThan0 expected integer greater than 0

function isLessThan10(val: unknown) {
  // 1st parameter is for min, 2nd parameter is max
  if (!isNumberWithinRange(val, undefined, 10)) {
    throw new InvalidNumberParameterError(val, { max: 10 }, isLessThan10.name);
  }
}

isLessThan10(100); // Error: isLessThan10 expected integer less than 100
```

Specifying neither a minimum nor a maximum causes the function to act purely as a typecheck:

```ts twoslash
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
// ---cut---
function isInteger(val: unknown) {
  if (!isNumberWithinRange(val)) {
    throw new InvalidNumberParameterError(val, {}, isInteger.name);
  }
}

isInteger(0.5); // Error: isInteger expects integer
```

The fourth parameter of `isNumberWithinRange` takes a boolean. Setting this to `false` disables the integer check. This is useful if you want to
assert that a given number is a float within a given range:

```ts twoslash
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
// ---cut---
function isFraction(val: unknown) {
  if (!isNumberWithinRange(val, 0, 1, false)) {
    throw new InvalidNumberParameterError(val, { min: 0, max: 1, integer: false }, isFraction.name);
  }
}

isFraction(2);   // Error: isFraction expects a number between 0 and 1
isFraction(0.5); // no error thrown
```

Specifying the different options as different parameters might be inconvenient. You can use the options object overload instead:

```ts twoslash
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
// ---cut---
function isFraction(val: unknown) {
  if (!isNumberWithinRange(val, { min: 0, max: 1, integer: false })) {
    throw new InvalidNumberParameterError(val, { min: 0, max: 1, integer: false }, isFraction.name);
  }
}
```

If you don't specify a minimum or a maximum and you disable the integer check, then the function only checks if the provided value has type `number` and is not `NaN`:

```ts twoslash
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';
// ---cut---
function isNumber(val: unknown) {
  if (!isNumberWithinRange(val, { integer: false })) {
    throw new InvalidNumberParameterError(val, { integer: false }, isNumber.name);
  }
}

isNumber(NaN);        // Error: isNumber expected number.
isNumber('whatever'); // Error: isNumber expected number.
```

### `assertNumberIsWithinRange`

[`assertNumberIsWithinRange`](../../../lib/modules-lib/Utilities#assertnumberwithinrange) is the assertion version of `isNumberWithinRange`.
You can use this function instead of doing the boolean check:

```ts twoslash
// @noErrors: 2393
import { InvalidNumberParameterError } from '@sourceacademy/modules-lib/errors';
import { assertNumberWithinRange, isNumberWithinRange } from '@sourceacademy/modules-lib/utilities';

function foo(val: unknown): asserts val is number {
  if (!isNumberWithinRange(val, 0, 1)) {
    throw new InvalidNumberParameterError(val, { max: 1, min: 0 }, foo.name);
  }
}

// can be written as
function foo(val: unknown): asserts val is number {
  assertNumberWithinRange(val, { max: 1, min: 0, func_name: foo.name });
}
```

### `InvalidNumberParameterError`

This is a subclass of the `InvalidParameterTypeError` that is thrown when a parameter is expecting a number, but the provided value is either not a number
or doesn't fall within the expected range.

Here are the parameters of the constructor:
1. The actual value that was validated
2. Either a `string` or an `InvalidNumberParameterErrorOptions` object.
  - If a string is provided, then that is taken as the name of the expected type
  - Otherwise, the options object controls what error message is shown to the user (i.e whether an integer or a number was expected, or if it was outside of the desired range)
3. Name of the function that the validation was performed for.
4. `param_name` _Optional_: Name of the parameter that the validation was performed for.

## Type Safety for functions

As part of ensuring type safety, there are several function related conventions bundle code should abide by:

### 1. Cadet facing functions with default, optional or rest parameters must use `wrapFunction`

The `wrapFunction` utility is exported from `js-slang/dist/utils/operators` and re-exported from `@sourceacademy/modules-lib/utilities`. You pass it the function
you are wrapping along with the name of the function and the number of optional arguments it has:

```ts twoslash
import { wrapFunction } from '@sourceacademy/modules-lib/utilities';

// Example with rest arguments:
// Notice that wrapFunction is called with true
export const sum = wrapFunction(
  (...x: number[]) => x.reduce((res, each) => each + res, 0),
  true,
  'sum'
);

// Example with rest argument, but also other parameters
// Notice that wrapFunction is still called with true since the function
// has a rest parameter
export const configure_options = wrapFunction(
  (op1?: boolean, op2?: boolean, ...args: boolean[]) => {
    // ...implementation
  },
  true,
  'configure_options'
);

configure_options(true);        // is ok
configure_options(true, false); // is ok

// Example with default arguments
// Notice that it is called with 1, since that's the number of optional arguments
// the function has
export const configure_options_2 = wrapFunction(
  (op0: boolean, op2: boolean = false) => op0 || op2,
  1,
  'configure_options_2',
);
```

If you don't specify the `optArgCount` parameter, then it is assumed that the function doesn't have any optional arguments or rest parameters.

`wrapFunction` is implemented with special Typescript types that should highlight if you have specified the number of optional arguments correctly:

```ts twoslash
// @errors: 2769
import { wrapFunction } from '@sourceacademy/modules-lib/utilities';

export const func_0 = wrapFunction(
  (x1: number, x2: number = 0) => x1 + x2,
  2, // Wrong number of optional parameters
  'func_0'
);

export const func_1 = wrapFunction(
  (x1: number, ...args: number[]) => x1 + args.length,
  2, // Should be true, since there is a rest parameter
  'func_1'
);
```

There is a less strict version called `wrapFunctionUnsafe` that can be used if the typing is too strict for your use case.

### 2. Cadet facing functions should not use destructuring for parameters

Javascript allows us to destruct iterables directly within a function's parameters:

```ts
export function foo([x, y]: [string, string]) {
  return x;
}
```

There's nothing inherently wrong with this, but if cadets pass a non-iterable object into the function,
Javascript is going to throw a fairly mysterious (to them) error:

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

In this case, Javascript doesn't actually throw an error if you pass an invalid object into the function:

```ts
function bar({ x, y }: BarParams) {
  return x;
}

console.log(bar(0)); // prints undefined
```

If an invalid argument gets passed, no error is thrown and the destructured values just take on the value of `undefined` (which you will have to check for).

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

In both cases, if instead the parameter isn't destructured, you have the chance to perform type checking:

```ts
export function foo(arr: [string, string]) {
  if (!Array.isArray(arr) && arr.length !== 2) {
    throw new InvalidParameterTypeError('Tuple of length 2', arr, foo.name, 'arr');
  }
  return arr[0];
}

export function bar2(obj: Bar2Params) {
  if (typeof obj !== 'object' || !('x' in obj)) {
    // throw an error....
  }

  return obj.x;
}
```

> [!INFO] isTupleOfLength
>
> In the case of the `foo` function above, there is also a type guard exported by `js-slang` and re-exported by `modules-lib` that can be used to
> assert that the given value is indeed a tuple (or simply an array) of a given length:
>
> ```ts twoslash
> import { InvalidParameterTypeError } from '@sourceacademy/modules-lib/errors';
> // ---cut---
> import { isTupleOfLength } from '@sourceacademy/modules-lib/utilities';
>
> export function foo(arr: [string, string]) {
>   if (isTupleOfLength(arr, 2)) {
>     throw new InvalidParameterTypeError('Tuple of length 2', arr, foo.name, 'arr');
>   }
>   return arr[0];
> }
> ```
>
> Of course, there is also an assertion version `assertTupleOfLength` available.

### 3. If a callback is passed as a parameter, its number of parameters should be validated

By default, Javascript doesn't really mind if you call a function with fewer arguments than it was defined with:

```js
function foo(x, y) {
  return `${x}, ${y}`;
}

foo(); // is fine, x and y are just `undefined`
```

Javascript also doesn't mind if you call a function with more arguments than it was defined with:

```js
function foo(a, b) {
  return a + b;
}

foo(1, 2, 'z'); // is fine, 3 is returned, last parameter is ignored
```

However in Source, both of the above examples will result in evaluation errors like the one below:

![](./argcount-error.png)

This is because Source doesn't allow for a mismatch between the number of arguments expected by a function and the number of arguments provided.

Thus, if your bundle's functions take callback parameters, it is essential that you check that the provided callback accepts the
correct number of parameters. This is done with the [`isFunctionOfLength`](../../../lib/modules-lib/Utilities#isfunctionoflength) utility provided by `modules-lib`:

```ts
import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';

function draw_connected(pts: number): (c: Curve) => void {
  function renderFunction(c: Curve) {
    if (!isFunctionOfLength(curve, 1)) {
      throw new InvalidCallbackError('Curve', curve, draw_connected.name);
    }

    // ...implementation details
  }

  return renderFunction;
}
```

Then, in Source, if the cadet provides an invalid curve (which would be functions that take only 1 parameter), an error is thrown:

```js
import { draw_connected, make_point } from 'curve';

draw_connected(200)((a, b) => make_point(a, 0)); // error: The provided curve is not a valid Curve function.
```

> [!INFO] InvalidCallbackError
>
> The `InvalidCallbackError` is a subclass of the `InvalidParameterTypeError`, specifically to be used for the error to be thrown
> for invalid callbacks. The parameters for its constructor are as follows:
> 
> 1. Number of Parameters/String representation of expected function:
>   - If a number is given, it is assumed that a function with that number of parameters is expected
>   - If a string is given, that will be used as a name for the function type.
> 2. The actual value passed in by the user
> 3. _Optional_: The name of the function that the error was thrown from (see [here](./3-errors) for more information)
> 4. _Optional_: The name of the parameter that is being validated

The `isFunctionOfLength` function is a type guard that also checks if the given input is a function at all, so it is
not necessary to check for that separately:

```ts
// A summarized implementation
function isFunctionOfLength(f: unknown, l: number): f is Function {
  return typeof f === 'function' && f.length === l;
}
```

> [!WARNING] Limitations of isFunctionOfLength
> 
> Of course, `isFunctionOfLength` can only guarantee that the object passed to it is indeed a function and that it takes
> the specified number of parameters. It won't actually guarantee at runtime that the provided parameters are of the defined types. For example:
> 
> ```ts twoslash
> // @noErrors: 2345
> import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
> import { InvalidCallbackError } from '@sourceacademy/modules-lib/errors';
> // ---cut---
> export function call_callback(f: (a: string, b: string) => void) {
>   if (!isFunctionOfLength(f, 2)) {
>     throw new InvalidCallbackError(2, f, call_callback.name);
>   }
> 
>   return f('a', 'b');
> }
>
> // isFunctionOfLength won't be able to guarantee that the passed callback is of type
> // (x: string, y: string) => void
> const callback = (x: number, y: number) => x * y;
> //    ^?
>
>
> // call_callback is being called here with a function of
> // type (x: number, y: number) => number
> call_callback(callback);
> ```
> 
> In fact, if you give it something of type `unknown`, the best it can do is narrow it down to a function that takes parameters of type `unknown`
> and returns a value with type `unknown`:
> 
> ```ts twoslash
> import { isFunctionOfLength } from '@sourceacademy/modules-lib/utilities';
> import { InvalidCallbackError } from '@sourceacademy/modules-lib/errors';
> // ---cut---
> export function call_callback(f: unknown) {
>   if (!isFunctionOfLength(f, 2)) {
>     throw new InvalidCallbackError(2, f, call_callback.name);
>   }
> 
>   return f('a', 'b');
>   //     ^?
>
>
> }
> ```
>
> It also cannot check for rest or optional parameters.

There is an assertion version of the function available: [`assertFunctionOfLength`](../../../lib/modules-lib/Utilities#assertfunctionoflength):

```ts twoslash
import { assertFunctionOfLength } from '@sourceacademy/modules-lib/utilities';

type Curve = (t: number) => number;

function foo(callback: Curve) {
  assertFunctionOfLength(callback, 1, foo.name, 'Curve', 'callback');
}
```

### 4. Calling user provided functions should be done with `js-slang` utils

If you need to call a function provided to you from the user, you should use either the `callIfFuncAndRightArgs` or `callWithoutMetadata` provided by `js-slang` (and re-exported
by `modules-lib`):

```ts twoslash
import { assertFunctionOfLength, callWithoutMetadata } from '@sourceacademy/modules-lib/utilities';

export function run_callback(f: () => void) {
  assertFunctionOfLength(f, 1, run_callback.name);
  callWithoutMetadata(f);
}
```

You can also provide arguments:

```ts twoslash
import type { Curve } from '@sourceacademy/bundle-curve/curves_webgl';
import { callWithoutMetadata } from '@sourceacademy/modules-lib/utilities';

export function makeNewCurve(c: Curve, numPoints: number): Curve {
  for (let i = 0; i < numPoints; i++) {
    const point = callWithoutMetadata(c, i / numPoints);
    // Do things with point...
  }

  return t => {
    return callWithoutMetadata(c, t);
  };
}
```

Calling a _user_ function directly may not behave as intended, especially when the `js-slang` transpiler is being used. However,
functions that are provided from the _standard library_ or from other module functions can still be called normally.

`callIfFuncAndRightArgs` is used when you want to provide extra metadata about where the function was defined:

```ts twoslash
import type { Curve } from '@sourceacademy/bundle-curve/curves_webgl';
import { callIfFuncAndRightArgs } from '@sourceacademy/modules-lib/utilities';

export function evaluateCurve(c: Curve, numPoints: number) {
  for (let i = 0; i < numPoints; i++) {
    // Line Number, Column Number, File name, NativeStorage (usually undefined), ...args
    const point = callIfFuncAndRightArgs(c, 4, 1, 'curve', undefined, i / numPoints);
    // Do things with point...
  }
}
```

> [!WARNING] Handling Stringification
>
> You will probably want to hide the fact that you are calling the user provided function via a proxy. Consider an example from the `repeat` bundle:
>
> ```ts
> // Handles the internal implementation for the `repeat` function
> export function repeat_internal<T>(f: UnaryFunction<T>, n: number): UnaryFunction<T> {
>   return n === 0 ? x => x : x => callWithoutMetadata(f, repeat_internal(f, n - 1)(x));
> }
> ```
>
> When the code below is run, the cadet can see that `f` is being called via `callWithoutMetadata`:
>
> ```js
> import { repeat } from 'repeat';
> const f = funcs.repeat(x => x, 1);
> stringify(f); // prints "(x) => callWithoutMetadata(f, repeat_internal(f, n - 1)(x))"
> ```
>
> You can of course override `toReplString`, but this could be tedious if you intend for the internals to be visible. Instead,
> wrap the cadet's function in another (local) function:
>
> ```ts
> export function repeat_internal<T>(f: UnaryFunction<T>, n: number): UnaryFunction<T> {
>   // Wrap the callWithoutMetadata call in another function
>   // so that the internal implementation is hidden
>   const func: UnaryFunction<T> = x => callWithoutMetadata(f, x);
>   return n === 0 ? x => x : x => func(repeat_internal(func, n - 1)(x));
> }
> ```
>
> Then the stringified version won't show `callWithoutMetadata`:
>
> ```js
> import { repeat } from 'repeat';
> const f = funcs.repeat(x => x, 1);
> stringify(f); // prints "(x) => func(repeat_internal(func, n - 1)(x))"
> ```
>
> This of course might not always be possible, in which case you should use other methods as appropriate.
