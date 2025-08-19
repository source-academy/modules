# Handling Abstractions

Source supports several primtive objects like numbers and strings. Slightly more complex primitives do also exist like lists and arrays. Your bundle may wish to introduce its own set of primitives, such as
`Sound` and `Wave` (from the `sound` bundle) or `BodyCentreTransformation` (from the `nbody` bundle).

The important thing to note is that as far as Javascript is concerned, these types are composed of other
primitive and non primitive objects (`Wave`s are `(t: number) => number` while `BodyCentreTransformation` is a class).

Instead of passing around the type in terms of primitives, you should make it such that cadets interact directly with the abstraction instead. Take the `sound` bundle for example.

`Sound`s are defined as a `pair`, where the head is a `Wave` and the tail is a number representing the duration of that sound:

```ts
import type { Pair } from 'js-slang/dist/stdlib/list';

type Sound = Pair<Wave, number>;
```

Functions from the `sound` bundle interact directly with `Sound`s, rather than the underlying type:

```ts
// Do this!
export function play_in_tab(sound: Sound): void {
  // ...implementation
}

// Don't do this!
export function play_in_tab(sound: Pair<Wave, number>): void {
  // ...implementation
}
```

Functionally, `Sound` behaves like a primitive type: as far as a cadet using the `sound` bundle is concerned, the bundle allows them to make and manipulate `Sound`s.

## Breaking Abstractions with `display` and `stringify`

`js-slang` provides a built-in function for converting any value into a string: `stringify()`. `display()` behaves like the typical `console.log` and prints the string representation
as returned by `stringify` to the REPL. Under the hood, `stringify` uses the default Javascript `toString` functionality to convert Javascript types to their string representations. This does
mean that for Source primitives that are actually Javascript objects, `js-slang`'s default implementation will end up exposing implementation details.

Taking an example from the `curve` bundle, `RenderFunction`s are considered a type of primitive. Without any further changes, calling `display` on a `RenderFunction` produces the following
output:

```js
// Partial toString() representation of a RenderFunction
curve => {
  const curveDrawn = generateCurve(scaleMode, drawMode, numPoints, curve, space, isFullView);
  if (!curve.shouldNotAppend) {
    drawnCurves.push(curveDrawn);
  }
  return curveDrawn;
};
```

This exposes implementation details to the cadet and "breaks" the `RenderFunction` abstraction. Thus, there is a need for such objects to be able to override the default `toString`
implementation.

## The `ReplResult` interface

To allow objects to provide their own `toString` implementations, objects can implement the `ReplResult` interface:

```ts
interface ReplResult {
  toReplString: () => string
}
```

::: details Not `toString`?
By not overriding `toString`, the default Javascript implementation for `toString` can be retained. Thus, we use `toReplString` instead.
:::

This function is called by `js-slang`'s `stringify()` and `display()` builtins to obtain the object's string representation.

There are two ways to implement `ReplResult`, [directly](#implementing-replresult-directly) and [indirectly](#implementing-replresult-indirectly). The former method is preferred,
but if your circumstances can't support it you can refer to the second method which should cover all of such scenarios.

> [!TIP]
> Source automatically hides the implementation for all functions at the top-level of a bundle. Running the code below
>
> ```ts
> import { show } from 'rune';
> 
> display(show);
> ```
>
> produces the following string output:
>
> ```txt
> function show {
>  [Function from rune
>      Implementation hidden]
> }
> ```
>
> This means that is is unnecessary to implement `ReplResult` for any of your top-level functions. You can still override this automatic functionality by implementing
> `ReplResult`.

### Implementing `ReplResult` directly

The simplest way to implement the interface is to do it in Typescript. For example, the `curve` bundle has a `Point` class, which is an abstraction of a point in 3D space with a color value:

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

`Point` is a class that directly implements the `ReplResult` interface.  If it didn't implement this interface, then calling `display(make_point(20, 20))`
would result in the infamous `[object Object]` being printed.

The type doesn't have to be a class, it can also be a Typescript [interface](https://www.typescriptlang.org/docs/handbook/2/objects.html):
```ts
interface Thing extends ReplResult {
  // ...implementation details
}
```

The benefit of implementing the interface this way in Typescript is that it enables type-checking to ensure that the interface is properly implemented.

### Implementing `ReplResult` indirectly

The `ReplResult` type is only just a Typescript interface. So long as `toReplString` property is present on the object/function, `js-slang` will be able to call it.

Referring back to the `curve` bundle's `RenderFunction`s, the type `RenderFunction` is really just a plain Javascript function with some extra properties attached to it:

```ts
type RenderFunction = {
  (func: Curve): CurveDrawn
  is3D: boolean
};

// Equivalent to
// type RenderFunction = ((func: Curve) => CurveDraw) & { is3D: boolean }
```

This type doesn't implement the `ReplResult` interface, but before `RenderFunction`s are returned, they have the `toReplString` property set:

```ts
// curve/src/functions.ts

function createDrawFunction(
  scaleMode: ScaleMode,
  drawMode: DrawMode,
  space: CurveSpace,
  isFullView: boolean
): (numPoints: number) => RenderFunction {
  return (numPoints: number) => {
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
    func.toReplString = () => `<${space==='3D' ? '3D' : ''}RenderFunction(${numPoints})>`;
    return func;
  };
}

// This has type (points: number) => RenderFunction
export const draw_connected = createDrawFunction('none', 'lines', '2D', false);
```

> [!TIP]
> Notice in this case that they abstraction is being applied to the return type of `draw_connected` and not to the return type of `createDrawFunction`. The latter
> is just a factory function for creating the different `draw_connected` function variants, each of which return `RenderFunction`s.
>
> As mentioned earlier, since `draw_connected` is exported at the top-level of the `curve` bundle, `ReplResult` is automatically implemented for it.

We've seen the result of the default `toString` implementation. By providing `toReplString`, `js-slang` can instead return a user-friendly stringified representation of a `RenderFunction`:

```js
import { draw_connected } from 'curve';

display(draw_connected(200));

// Produces the output below
// <RenderFunction(200)>
```

Implementing `ReplResult` indirectly like this works just as well as the direct method, just that Typescript may not be able to
provide compile time validation that the property has been set correctly.

> [!IMPORTANT]
> Theoretically, there should be very few cases where you won't be able to write a type that can't also implement the `ReplResult`
> interface, so there should be no need for this, but this section is here as a "just in case".

## Simple Abstractions

There may be cases where you intend for your abstraction to be "decomposable" by cadets. The `Sound` type is just a wrapper around a `js-slang` pair:

```ts
type Wave = (t: number) => number;
type Sound = Pair<Wave, number>;
```

For both of these types, the default `toString` behaviour closely follows their definitions:

```ts
const s = make_sound(t => 0, 1000);
display(s);
// Produces the output below
// [t => t >= duration ? 0 : wave(t), 100]
```

Calling `display` on a `Sound` prints out a pair consisting of a function and a number. In this case, then, it becomes unnecessary to apply abstractions and implement the `ReplResult` interface.

## Avoid using raw object literals

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
export function change_text_options(options: TextOptions): void;
```

Alternatively, you could do something like this:

```ts
interface TextOptions {
  color: string
  size: number
}
export function create_text_options(color: string, size: number): TextOptions;
export function change_text_options(options: TextOptions): void;

// Used like this:
const options = create_text_options('blue', 20);
change_text_options(options);
```

The idea is that the abstraction of the `TextOptions` type is never broken and that the cadet never interacts with the object's component parts directly.
