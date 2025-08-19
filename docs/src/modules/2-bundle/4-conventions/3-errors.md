# Error Handling

As a continuation of the previous section, and important part of hiding a bundle's implementation details involves handling error conditions and errors
that could be thrown.

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

If the error is thrown from a function that's only meant for internal use, then that function should take a `name` string parameter instead:

```ts
// throwIfNotRune isn't exported, it is supposed to be called
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

## Source Type Checking

Though bundles are written in Typescript, Source (except for the Typed Variant) does not support anything beyond rudimentary type checking. This means that it can determine that an expression
like `1 - "string"` is badly typed, but it can't type check more complex programs like the one below, especially when bundle functions are involved:

```ts
import { show } from 'rune';

// Error: show expects a rune!
show(1);
```

::: details Type Maps
Source is moving toward enabling compile-time (or at least pre-execution since Source programs don't really have a "compilation" step) type checking for Source Modules using a feature known as [type maps](../7-type_map).
:::

The above call to `show` won't a throw compile-time error. Instead, the error is thrown at runtime by bundle code. This is the case even if the function has been annotated with
Typescript types.

As seen above, `show`'s functionality is pretty simple. This means that if it gets called with something that isn't a `Rune` the error might end up being thrown further downstream by other `rune` bundle functions
or by the `Rune` tab.

This is not helpful for the cadet's debugging, as the error occurred in `show`. Thus, by checking if the passed parameter is indeed a `Rune` before
passing it on to other `rune` bundle functions, we make error tracing a lot simpler for cadets.

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
:::
