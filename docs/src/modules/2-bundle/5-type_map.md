# Bundle Type Maps
Sometimes, a bundle's exports may have very complex types, or types that leak implementation details. Or, a bundle's author
might want to present an export with a different type than the one used in its Typescript source code.

You can refer to this [PR](https://github.com/source-academy/modules/pull/331) and this [issue](https://github.com/source-academy/modules/issues/326) for the original implementation and proposal details.

Regardless of the situation, type maps are a way for bundle authors to control the types of their bundle's exports.

> [!NOTE]
> Currently `js-slang` only performs any kind of type checking for modules when the typed Source variant is used.
> This means that type maps are only used by the typed Source Variant.
>
> This also means that documentation (mentioned [here](./4-documentation/4-documentation)) will not reflect the types specified by the type map

Type Maps are opt-in. If the bundle does not provide a type map, then no type checking is performed on its exports, similar to
how `skipLibCheck: true` is used in Typescript.

## Configuring a Type Map
To create a type map, use the `createTypeMap` utility from `@sourceacademy/modules-lib/type_map`.
```ts
// rune/src/type_map.ts
import createTypeMap from '@sourceacademy/modules-lib/type_map';

const typeMapCreator = createTypeMap();

export const { functionDeclaration, variableDeclaration, classDeclaration, typeDeclaration } = typeMapCreator;

/** @hidden */
export const type_map = typeMapCreator.type_map;
```

Note that the type map export has a `@hidden` documentation tag applied to it.

To configure the type map, you then use the functions returned by the utility as [decorators](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/#decorators):

```ts
// rune/src/functions.ts
import { functionDeclaration } from './type_map';

class RuneFunctions {
  // The use of decorators requires us to define these functions within a class
  @functionDeclaration('x: number, y: number, rune: Rune', 'Rune')
  static translate(x: number, y: number, rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.translate.name, rune);
    const translateVec = vec3.fromValues(x, -y, 0);
    const translateMat = mat4.create();
    mat4.translate(translateMat, translateMat, translateVec);

    const wrapperMat = mat4.create();
    mat4.multiply(wrapperMat, translateMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }
}
// ... other functions

/**
 * Translates a given Rune by given values in x and y direction
 * @param x - Translation in x direction
 * @param y - Translation in y direction
 * @param rune - Given Rune
 * @return Resulting translated Rune
 * @function
 *
 * @category Main
 */
export const translate = RuneFunctions.translate;
```

> [!WARNING]
> The decorators returned by `createTypeMap` will only populated the type map returned by the same call to `createTypeMap`. Multiple
> calls to `createTypeMap` will return entirely new and unrelated decorators and type map instances.
>
> If you need to use the decorators across files, re-export the decorators as shown above instead of calling `createTypeMap` multiple times.

> [!TIP] Writing Documentation with Type Maps
> Notice that when re-exporting, the documentation is attached to the constant declaration and not the declaration in the class. This is so that
> the documentation is properly applied to the exported function.
>
> Also notice that the `@function` tag has been applied. More information about why this is necessary can be found [here](./4-documentation/4-documentation#use-of-function)

Remember to export your type map from the bundle's entry point:
```ts
// rune/src/index.ts
export { type_map } from './type_map';
```

## Type Map Utilities
There are four decorators returned by `createTypeMap`:

### `variableDeclaration`
Use this decorator to type constant declarations that are not supposed to behave like functions. The decorator takes one parameter, which is the string
representation of the type of the variable.

```ts
import { variableDeclaration } from './type_map';

class RuneFunctions {
  @variableDeclaration('Rune')
  static square: Rune = getSquare();
}
```
This decorator can only be applied to members of a class, so it may be necessary to wrap your variables in a class and
have them declared as static members.

### `functionDeclaration`
Use this decorator to type declarations that are supposed to be callable. This decorator takes two parameters:
1. The string representation of the types and names of its parameters
1. The string representation of its return type

```ts
import { functionDeclaration } from './type_map';

class RuneFunctions {
  // The use of decorators requires us to define these functions within a class
  @functionDeclaration('x: number, y: number, rune: Rune', 'Rune')
  static translate(x: number, y: number, rune: Rune): Rune {
    throwIfNotRune(RuneFunctions.translate.name, rune);
    const translateVec = vec3.fromValues(x, -y, 0);
    const translateMat = mat4.create();
    mat4.translate(translateMat, translateMat, translateVec);

    const wrapperMat = mat4.create();
    mat4.multiply(wrapperMat, translateMat, wrapperMat);
    return Rune.of({
      subRunes: [rune],
      transformMatrix: wrapperMat
    });
  }
}
```

This decorator can only be applied to members of a class, so it may be necessary to wrap your variables in a class and
have them declared as static members.

### `classDeclaration`
This declarator is used to represent actual classes. It takes parameter, the string representation of the type it is wrapping.

The decorator can be applied directly to the class:
```ts
import { classDeclaration } from './type_map';

@classDeclaration('Rune')
export class Rune {
  constructor(
    public vertices: Float32Array,
    public colors: Float32Array | null,
    public transformMatrix: mat4,
    public subRunes: Rune[],
    public texture: HTMLImageElement | null,
    public hollusionDistance: number
  ) {}

  // implementation details...
}
```

### `typeDeclaration`
This decorator is used to represent Typescript types. Since Typescript types are intended to be erased entirely to produce
plain Javascript, it may be necessary to apply these decorators to dummy classes:
```ts
// Actual type of curve in Typescript is type Curve = (u: number) => Point

@typeDeclaration('(u: number) => Point')
class Curve {}
```
