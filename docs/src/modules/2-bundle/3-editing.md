# Editing an Existing Bundle
This page contains instructions for modifying an existing bundle. If you are creating a new bundle from scratch, refer to [these](./2-creating/2-creating) instructions instead.

## Installing Dependencies
To install **only** the dependencies required by the bundle you are modifying, use the command below:

```sh
yarn workspaces focus @sourceacademy/bundle-[desired bundle]
```

## Adding Dependencies
Your bundle may need other Javascript packages. To add a dependency to your bundle, run the command below:
```sh
yarn add [dependency]
```

If the dependency does not need to be present during runtime, then use:
```sh
yarn add --dev [dependency]
```
This adds the dependency to `devDependencies` instead.

> [!WARNING]
> You should only run this command in the directory of your bundle. Otherwise, the dependency will end up being added to the
> root repository.

> [!NOTE]
> There are certain dependencies that are common to all bundles (like `react`). When adding such a dependency, remember to add the exact version
> specified in the root repository `package.json`:
> ```sh
> yarn add react@^18.3.1
> ```
> You can also use the command `yarn constraints`  to check if you have incorrectly specified the version of a dependency.

> [!NOTE]
> When adding dependencies that originate from the repository (e.g `@sourceacademy/modules-lib`), use `workspace:^` as the given version:
> ```sh
> yarn add @sourceacademy/modules-lib@workspace:^
> ```

## Bundle Conventions
To ensure that bundles conform to the different Source language specifications, there are a few rules that bundles need to abide by:

### 1. Cadet facing functions should not have default or rest parameters
The function signature below takes in two booleans, the second of which is optional. This is discouraged in Source, but is fine if your function
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

### 2. If your bundle requires specific Source features, make sure to indicate it in the manifest
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

::: details Which data type to use?
In the above example, `args` can actually be replaced with a Source `List`:
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

### 3. Cadet facing functions should not require object literals
Object literals are not supported in Source, but might be required in bundle code. For example, in the case where your bundle might have several configurable options that the cadet can change,
you should have a function for each option rather than a single function that takes all the options:
```ts
// Do this!
export function change_text_color(color: string): void;
export function change_text_size(size: number): void;

// And not this!
interface TextOptions {
  color: string
  size: number
}
export function change_text_options(options: TextOptions): void
```
If your bundle requires the passing of objects around, they should be given an appropriate abstraction and follow the rules set out in the [next](#4-object-literalsnon-source-primitives-returned-by-bundles-should-implement-replresult) section.

### 4. Object literals/Non-Source Primitives returned by bundles should implement `ReplResult`
If your bundle exports an object that is intended to be an abstraction, then it should implement the `ReplResult` interface.

For example, the `curve` bundle's `draw_connected` functions return a `RenderFunction`.  The type `RenderFunction` is really just a plain Javascript function with some extra properties attached to it:

```ts
type RenderFunction = {
  (func: Curve): CurveDrawn
  is3D: boolean
}

// Equivalent to
// type RenderFunction = ((func: Curve) => CurveDraw) & { is3D: boolean }
```

Calling `stringify()` or `display()` (both Source builtins) on the return type of `draw_connected` would then result in the entire function body being displayed:
```js
curve => {
  // Partial toString() representation of a RenderFunction
  const curveDrawn = generateCurve(scaleMode, drawMode, numPoints, curve, space, isFullView);
  if (!curve.shouldNotAppend) {
    drawnCurves.push(curveDrawn);
  }
  return curveDrawn;
}
```
This is undesirable: implementation details should be hidden from cadets. Instead, by either directly or indirectly implementing the `ReplResult` interface,
a user-friendly stringified representation of the object is provided:
```js
import { draw_connected } from 'curve';
display(draw_connected(200));

// Produces the output below
// <RenderFunction(200)>
```

In this case, `ReplResult` is implemented indirectly by setting the `toString` property on the `RenderFunction` before it is returned:
```ts
// curve/src/functions.ts

const func = (curve: Curve) => {
  const curveDrawn = generateCurve(
    scaleMode,
    drawMode,
    numPoints,
    curve,
    space,
    isFullView
  );

  if (!curve.shouldNotAppend) {
    drawnCurves.push(curveDrawn);
  }

  return curveDrawn;
};
// Because the draw functions are actually functions
// we need hacky workarounds like these to pass information around
func.is3D = space === '3D';
func.toString = () => `<${space==='3D' ? '3D' : ''}RenderFunction(${numPoints})>`; // [!code highlight]
return func;
```

The `curve` bundle also has a `Point` type, which is an abstraction of a point in 3D space with a color value:
```ts
/** Encapsulates 3D point with RGB values. */
export class Point implements ReplResult {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
    public readonly color: Color
  ) {}

  public toReplString = () => `(${this.x}, ${this.y}, ${this.z}, Color: ${this.color})`;
}
```

Since `Point` is a class, it can directly implement the `ReplResult` interface. If it didn't implement this interface, then calling `display(make_point(20, 20))` would
result in the infamous `[object Object]` being printed.

::: details `toString` vs `toReplString`
For objects that are direct members of a bundle, you should use `toReplString` to provide the string representation for that object. Because `RenderFunctions` are
created directly in Source code (it is `draw_connected` that is a direct member of the `curve` bundle), Source uses the `toString` property instead to obtain the string representation.
:::

This same principle applies to other Javascript primitives as well. For example, Symbols and RegExp expressions are primitives in regular Javascript, but are not allowed in Source.

You can use these type abstractions directly in your functions:
```ts
export function make_point(x: number, y: number): Point // Returns a Point!
```

These type abstractions do **not** need to be exported from your bundle's entry point. The documentation generators will ignore such type exports.

> [!TIP] Simple Abstractions
> Take the type `Sound` from the `sound` bundle. A `Sound` is defined as a pair consisting where the head is a function that returns the sound's waveform
> and the tail is the sound's duration:
> ```ts
> type Wave = (t: number) => number
> type Sound = Pair<Wave, number>
> ```
> The `Wave` type is intentionally defined as a function that takes in a number and returns another number. For both of these types,
> the default `toString` behaviour closely follows their definitions
> ```ts
> const s = make_sound(t => 0, 1000);
> display(s);
> // Produces the output below
> // [t => t >= duration ? 0 : wave(t), 100]
> ```
> In this case, then, it becomes unnecessary to apply abstractions and implement the `ReplResult` interface.

### 5. Error Handling
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
If the error is thrown from a bundle internal function, then that function should take a `name` string parameter instead:
```ts
// throwIfNotRune isn't supposed to be exported, but it is supposed to be called
// from functions that are
function throwIfNotRune(func_name: string, obj: unknown): asserts obj is Rune {
  if (!(rune instanceof Rune)) throw new Error(`${func_name} expects a rune as argument.`);
}

// like show
export function show(rune: Rune) {
  throwIfNotRune(show.name, rune);
  drawnRunes.push(new NormalRune(rune));
  return rune;
}
```

Then, the error can be thrown with the correct function name. Otherwise, cadets would see that the error originated from `throwIfNotRune`, which is not a function
that is visible to them, and it doesn't tell them which function the error was thrown from (was it `show`? or `anaglyph`? or something else?)

#### Type Checking
Though bundles are written in Typescript, Source (except for the Typed Variant) does not support anything beyond rudimentary type checking. This means that it can determine that an expression
like `1 - "string"` is badly typed, but it can't type check more complex programs like the one below, especially when bundle functions are involved:

```ts
import { show } from 'rune';

// Error: show expects a rune!
show(1);
```
The above call to `show` won't a throw compile-time error. Instead, the error is detected at runtime by bundle code. This is the case even if the function has been annotated with
Typescript types:
```ts
function throwIfNotRune(func_name: string, obj: unknown): asserts obj is Rune {
  if (!(rune instanceof Rune)) throw new Error(`${func_name} expects a rune as argument.`);
}

export function show(rune: Rune) {
  throwIfNotRune(show.name, rune);
  drawnRunes.push(new NormalRune(rune));
  return rune;
}
```

> [!TIP]
> The `asserts obj is Rune` syntax is known as a _type guard_, a feature supported by Typescript to help assist the compiler in type narrowing.
> More information can be found [here](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
>
> Where possible, you should make use of type guards to help increase the type safety of your bundle code

### 6. Making use of `js-slang/stdlib`
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

## Adding Unit Tests
Where possible, you should add unit tests to your bundle. Refer to [this](/modules/4-advanced/testing) page for instructions.
