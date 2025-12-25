# Documentation Generation

There are two types of documentation used by Source, which are the JSONs and the HTML documentation. Both are built using the [`typedoc`](https://typedoc.org) tool. By reading comments and type annotations, `typedoc` is able to generate both human readable documentation and documentation in the form of JSON.

## Typedoc Overview

Documentation generation is a two-step process:

Firstly, the `buildtools build docs` is called on each bundle. This produces two JSON files:

1. `build/jsons/[bundle_name].json`, which is the JSON documentation used by `js-slang` and the frontend
2. `docs.json`, which is JSON documentation format used by `typedoc` to generate the HTML documentation later

Second, `buildtools html` is called, which then takes the `docs.json` files from each bundle and uses the [`merge` entry point strategy](https://typedoc.org/documents/Options.Input.html#merge) to create the HTML
documentation

> [!NOTE]
> Since type checking is supposed to be performed by `tsc`, `skipErrorChecking` has been set to true. This means that if there are type errors in the source files being processed,
> `typedoc` simply returns `undefined` when `Application.convert` is called.

This allows each bundle to have its own Typedoc option set.

## Custom Checks

There are two important custom checks that our documentation generation must perform:

### Typing Variables as Functions

Because Typedoc no longer automatically considers function-like types as functions, developers must use the `@function` tag to allow
Typedoc to properly infer that a function-like variable should be documented as a function.

When generating the documentation, we simply check if the corresponding item has been assigned a variable type while having function signatures. If this
is the case, then we print a warning advising the developer that they may have forgotten the `@function` tag.

### Hiding Type Guards

Typescript has a feature called type guards that allow the compiler to better narrow types, increasing the type safety of module code. 

When Typedoc encounters a type guard, it documents the return type of that type guard as is.

```ts
export function is_boolean(obj: unknown): obj is boolean {
  return typeof obj === 'boolean';
}
```

The function above has its return type rendered as `obj is boolean`. However, this might confuse cadets as type guards are not a concept in Source,
and the return type as rendered also hides the fact that `is_boolean` returns a `boolean` and not some other special value.

To remedy this, when generating the documentation for type guards, we simply replace the return type of the signature with `boolean` (or `void` if
it's an asserts guard). This modification is done on "conversion" by hooking into the `Converter.EVENT_CREATE_SIGNATURE` event.

## HTML Generation

It is not possible to generate the HTML documentation on a per-bundle basis. Thus, when HTML documentation needs to be regenerated, the source files of every single bundle needs to be processed.

## JSON Generation

`typedoc` represents each bundle as a [`DeclarationReflection`](https://typedoc.org/api/classes/Models.DeclarationReflection.html) internally. Each of these `DeclarationReflection`s contains an array of "children" elements which
represents that bundle's exports. Each of these elements is parsed by various parsers to produce the desired documentation object, which is then written to disk after converted into a JSON string.
