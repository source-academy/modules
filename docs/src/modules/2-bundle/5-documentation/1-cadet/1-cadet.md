---
title: Cadet Documentation
outline: [2]
---
# Bundle Documentation for Cadets

For cadets to know how to use your bundle's functionalities, you must provide documentation. Cadet documentation for Source bundles is generated using the [`typedoc`](https://typedoc.org) tool. There are two types: HTML and JSON documentation.

By reading comments and type annotations, `typedoc` is able to generate both human readable documentation and documentation in the form of JSON.

> [!WARNING]
> `typedoc` normally performs type checking for code before generating its outputs. This functionality has been turned off for this repository as more often then not, `tsc` will be run before `typedoc`, making the type checking performed by `typedoc` extraneous.
>
> This does mean that if the documentation is built without running `tsc`, there is a possibility that type errors will cause `typedoc` to crash.

Your documentation should be comprehensive and detailed such that someone with no experience with your bundle will be able to learn and use the its
functionalities from scratch.

## Rendered Output

There are two kinds of documentation that gets rendered:

### HTML Documentation

The human readable documentation resides in the `build/documentation` folder. You can view its output [here](https://source-academy.github.io/modules/documentation). This is what the output for `make_point` looks like:

![image](./htmlDocs.png)

The description block supports formatting using Markdown. The markdown is translated into HTML during building.

> [!TIP] Previews via IntelliSense
>
> If you are using VSCode, IntelliSense does pretty good job of showing you how your documentation will look like when rendered as HTML.
> Of course, the theme and layouts are different, but the rendering from markdown to HTML (including the different tags) should be the same.
>
> There will be some differences, since Typedoc and VSCode aren't identical in terms of the documentation features they support.

### JSON Documentation

To provide the frontend with documentation that can be directly displayed to the user, each module has its own json file in the `jsons` folder containing the formatted descriptions of exported variables.
Using the example code above, here is what the JSON documentation looks like for the `make_point` function from the `curve` bundle:

```jsonc
{
  "make_point": {
    "kind": "function",
    "name": "make_point",
    "description": "<p>Makes a Point with given x and y coordinates.</p>",
    "params": [
      {
        "paramType": "regular",
        "type": "number",
        "name": "x"
      },
      {
        "paramType": "regular",
        "type": "number",
        "name": "y"
      }
    ],
    "retType": "Point"
  },
  // ...other functions and constants
}
```

This is then displayed by the frontend:

![image](./sourceDocs.png)

When building the json documentation for a bundle, the following steps are taken:

1. From `typedoc`'s output, extract the [project](https://typedoc.org/api/classes/ProjectReflection.html) corresponding to the bundle.
1. For each exported variable, run it through a converter to convert the `typedoc` project into a single string:
    - For constants, their names and types are extracted
    - For functions, their name, the names and types of each parameter, and return types are extracted.\
    The descriptions of both functions are constants are also included, but first they are passed through a Markdown to HTML converter called [drawdown](https://github.com/adamvleggett/drawdown), included in this project as `drawdown.ts`
1. The code then converts it to the HTML format expected by the frontend
1. All the processed strings then get written to a json file in the `jsons` folder.

If no documentation could be found, or there was an error parsing the documented code, the system will still output JSONs, just with warnings.

## Writing Documentation

`typedoc` reads both Typescript type annotations, as well as [TSDOC](https://tsdoc.org) style comments. It will build documentation for all functions and constants exported by the particular bundle's entry point.
For example, since the `curve` bundle exports the `make_point` function, `typedoc` will generate documentation for it. However, there are many other functions that the bundle does not expose that won't have documentation generated.

Documentation should be written in [Markdown](https://www.markdownguide.org/getting-started/). That way, both IntelliSense and Typedoc will be able to process it. During documentation generation,
the markdown is converted to raw HTML.

::: details Type Aware annotations

[JSDoc](https://jsdoc.app) (and TSDoc) both support annotations that express type information directly like `@type` or annotations that can optionally contain type information like `@param` and `@returns`.
Since modules are already written in Typescript, there is no need to use type-aware annotations to document the type of an object.

All type annotations should be written in directly Typescript
so as not to confuse Typedoc and ensure that the Typescript compiler is able to ensure type safety.

If you do need to the type of an export to be documented differently from its type in Typescript source code, you can use a [type map](../../7-type_map).
:::

Let us look at some examples.

### Entry Point

At the entry point for each bundle, there should be a block comment that provides general information about the bundle.

This example is taken from the `repeat` bundle:

```ts
// repeat/src/index.ts
/**
 * Test bundle for Source Academy modules repository
 * @author Loh Xian Ze, Bryan
 * @author Tang Xin Kye, Marcus
 * @module repeat
 */

export { repeat, twice, thrice } from './functions';
```

It is important that you provide an `@module` tag in this description. Otherwise, the build tools may not be able to detect your bundle's
documentation properly.

> [!TIP]
> An ESLint Rule has been configured specifically for this purpose, so a lint error should appear if you forget to do so.

### Functions

```ts
// curve/src/functions.ts
/**
 * Makes a Point with given x and y coordinates.
 *
 * @param x x-coordinate of new point
 * @param y y-coordinate of new point
 * @returns with x and y as coordinates
 * @example
 * ```
 * const point = make_point(0.5, 0.5);
 * ```
 */
export function make_point(x: number, y: number): Point {
  return new Point(x, y, 0, [0, 0, 0, 1]);
}
```

Notice that in the example above, each `@param` tag is followed directly by the name of the parameter its describing, which is then followed
by the description of the parameter itself.

Missing the documentation for a parameter is okay (not that you should), but trying to document a parameter that doesn't exist will cause a linting
error:

```ts
/**
 * Oops p1 isn't documented!
 * @param p3 This parameter doesn't exist and so this will cause a lint error!
 */
export function foo(p1: string, p2: string) {
  // ...implementation
}
```

> [!WARNING] Using @function
>
> Following v0.28, Typedoc only documents function-like types as functions if they are explicitly typed as functions (see the issue [here](https://github.com/TypeStrong/typedoc/issues/2881)).
> This means that if you have code that looks like this:
>
> ```ts
> // curve/functions.ts
> function createDrawFunction(
>   scaleMode: ScaleMode,
>   drawMode: DrawMode,
>   space: CurveSpace,
>   isFullView: boolean
> ): (numPoints: number) => RenderFunction {
>   return (numPoints: number) => {
>     // implementation details
>   };
> }
> 
> export const draw_connected = createDrawFunction('none', 'lines', '2D', false);
> ```
>
> and `RenderFunction` has the following type:
>
> ```ts
> // curve/types.ts
> /**
>  * A function that specifies additional rendering information when taking in
>  * a CurveFunction and returns a ShapeDrawn based on its specifications.
>  */
> export type RenderFunction = {
>   (func: Curve): CurveDrawn;
>   is3D: boolean;
> };
> ```
>
> Typedoc won't consider `draw_connected` to be a function. Instead it will consider it to be a variable:
>
> ![](./drawConst.png)
>
> This is because `drawConnected` is of type `RenderFunction` and `RenderFunction` is only _function-like_.
> To remedy this, you can either change the type to be an actual function type, or include the `@function` tag in your documentation:
>
> ```ts {6}
> /**
>  * Returns a function that turns a given Curve into a Drawing, by sampling the
>  * Curve at `num` sample points and connecting each pair with a line.
>  * The parts between (0,0) and (1,1) of the resulting Drawing are shown in the window.
>  *
>  * @function
>  * @param num determines the number of points, lower than 65535, to be sampled.
>  * Including 0 and 1, there are `num + 1` evenly spaced sample points
>  * @return function of type Curve → Drawing
>  * @example
>  * ```
>  * draw_connected(100)(t => make_point(t, t));
>  * ```
>  */
> export const draw_connected = createDrawFunction('none', 'lines', '2D', false);
> ```
>
> The export will now be correctly recognized as a function:
>
> ![](./drawFunc.png)
>
> The buildtools are configured to emit a warning if a variable is detected to have function signatures but cannot automatically rectify
> this problem.

### Variables/Constants

Constants can be documented in a similar fashion:

```ts
/**
 * Represents the mathematical constant PI
 */
const PI: number = 3.14159;
```

Also similar to function return types and parameters, because the types of variables is determined by the Typescript compiler, it is unnecessary
to use the `@type` tag here.

### `@category`

If you have a large number of exports, it would be easier for cadets to navigate your bundle's documentation if you sorted your exports into different categories.

This is done with the `@category` tag.

```ts {4}
/**
 * Returns a boolean value indicating whether the given value is a {@link NoteWithOctave|note name with octave}.
 * @function
 * @category Main
 */
export function is_note_with_octave(value: unknown): value is NoteWithOctave {
  const res = parseNoteWithOctave(value);
  return res !== null;
}
```

Then when the HTML documentation is rendered, it will be located within a separate folder:
![](./categories.png)

Notice the "Other" category. This is the default category that your exports will get sorted into if it has no
category specified.

### `@defaultValue`

By default, Typedoc renders the expression that you used to initialize a variable with:

![](./defaultValue1.png)

This might cause implementation details to be exposed (such as in the example above). Often, only the _type_ of the value matters, not its exact value. Thus, this behaviour is automatically disabled and variables are only rendered with their type:

![](./defaultValue2.png)

If you wish to retain the default behaviour, you can include the `@defaultValue` tag. Note that this tag should be left empty:

```ts {8}
/**
 * This function is a Curve transformation: a function from a Curve to a Curve.
 * The points of the result Curve are the same points as the points of the
 * original Curve, but in reverse: The result Curve applied to 0 is the original
 * Curve applied to 1 and vice versa.
 *
 * @param original original Curve
 * @defaultValue
 * @returns result Curve
 */
export const invert = CurveFunctions.invert;
```

### `@example`

`@example` blocks allow the developer to provide code snippets that serve as examples for for how the function/variable is intended to be
used. Consider an example from the `midi` bundle below:

```ts {10-13}
/**
 * Converts a letter name to its corresponding MIDI note.
 * The letter name is represented in standard pitch notation.
 * Examples are "A5", "Db3", "C#7".
 * Refer to <a href="https://i.imgur.com/qGQgmYr.png">this</a> mapping from
 * letter name to midi notes.
 *
 * @param note given letter name
 * @return the corresponding midi note
 * @example
 * ```
 * letter_name_to_midi_note('C4'); // Returns 60
 * ```
 * @function
 */
export function letter_name_to_midi_note(note: NoteWithOctave): MIDINote {}
```

When the documentation is renderered, a code block is produced:

![](./docExample.png)

Note that your code examples should be surrounded in a Markdown code block (using the triple backticks ```` ``` ````). This will
help Typedoc figure out what content belongs to your code block. The code block should begin the line after the `@example` tag

```ts
/**
 * @example
 * ```
 * const x = 10 + 10;
 * ```
 */
```

rather than on the same line:

```ts
/**
 * @example ```
 * const x = 10 + 10;
 * ```
 */
```

The language specifier is not required here as it is assumed that your code examples are written in Typescript.

::: details Why you should use a code block

If you use an inline code example, Typedoc might include things in your example that you didn't mean to include. Consider
a modified version of the example above:

```ts {10}
/**
 * Converts a letter name to its corresponding MIDI note.
 * The letter name is represented in standard pitch notation.
 * Examples are "A5", "Db3", "C#7".
 * Refer to <a href="https://i.imgur.com/qGQgmYr.png">this</a> mapping from
 * letter name to midi notes.
 *
 * @param note given letter name
 * @return the corresponding midi note
 * @example letter_name_to_midi_note("C4"); // Returns 60
 * @function
 */
export function letter_name_to_midi_note(note: NoteWithOctave): MIDINote {}
```

Typedoc ends up including the `@function` tag as part of the code block:

![](./wrongDocExample.png)

Using a code block makes it clear exactly what is intended to be part of your example code block.
:::

During documentation generation, the code in your code block will be parsed by a Typescript parser to ensure that you have written
valid Typescript code. It will print a warning message if your example code doesn't produce syntactically valid Typescript.

### `@internal` and `@hidden`

Both tags are used to exclude exports from the output of the documentation. `@internal` is used to mark
things that should be hidden from cadets, but still need to be visible to developers (for example, you might
want to hide something from cadet code but export it for other bundles to use).

`@hidden` is used to hide something entirely (for example, a variable that is intended only to be visible from within
your bundle).

The example below is taken from the `rune` bundle:

```ts
// rune/src/type_map.ts
import createTypeMap from '@sourceacademy/modules-lib/type_map';

const typeMapCreator = createTypeMap();

export const { functionDeclaration, variableDeclaration, classDeclaration } = typeMapCreator;

/** @internal */
export const type_map = typeMapCreator.type_map;
```

This causes `type_map` to be removed from the documentation, even if it is exported from `rune/src/index.ts`.

> [!WARNING]
> Bundle `type_map`s are supposed to be internal implementation details hidden from users. If you forget to hide
> your bundle's type map export, the build tools will show a warning.
>

### `@link`

`@link` tags are used inline to create navigable hyperlinks. Here is an example from the `robot_simulation` bundle:

```ts
/**
 * Creates a cuboid. joel-todo: The dynamic version wont work
 *
 * This function is used to create the {@link createFloor | floor} and {@link createWall | wall} controllers.
 *
 * The returned Cuboid object is designed to be added to the world using {@link addControllerToWorld}.
 *
 * **This is a Controller function and should be called within {@link init_simulation}.**
 *
 * @param physics The physics engine passed to the world
 * @param renderer  The renderer engine of the world. See {@link createRenderer}
 * @param position_x The x position of the cuboid
 * @param position_y The y position of the cuboid
 * @param position_z The z position of the cuboid
 * @param width The width of the cuboid in meters
 * @param length The length of the cuboid in meters
 * @param height The height of the cuboid in meters
 * @param mass The mass of the cuboid in kg
 * @param color The color of the cuboid. Can be a hex code or a string. See {@link https://threejs.org/docs/#api/en/math/Color}
 * @param bodyType "rigid" or "dynamic". Determines if the cuboid is fixed or can move.
 * @returns Cuboid
 *
 * @example
 * ```
 * init_simulation(() => {
 *   const physics = createPhysics();
 *   const renderer = createRenderer();
 *   const timer = createTimer();
 *   const robot_console = createRobotConsole();
 *   const world = createWorld(physics, renderer, timer, robot_console);
 *
 *   const cuboid = createCuboid();
 *   addControllerToWorld(cuboid, world);
 *
 *   return world;
 * });
 * ```
 *
 * @category Controller
 */
```

This is the rendered output:

![](./createCuboid.png)

As seen above, you can link directly to declarations (functions, variables, types etc...) or to external websites. You can also provide alternate
text for links. Typedoc's rendering behaviour is describe in detail [here](https://typedoc.org/documents/Tags.__link_.html).

> [!TIP] Typedoc Resolution Errors
>
> Typedoc sometimes complains that it can't find the thing you're linking to:
>
> ```txt
> [warning (curve)] Failed to resolve link to "scale" in comment for curve
> ```
>
> Typedoc lets you customize how these symbols get resolved using the system described in the link above, but sometimes you just need to add
> a single exclamation mark to tell Typedoc to look within your current module to find that export:
>
> ```ts
> /**
>  * A *curve transformation* is a function that takes a curve as argument and
>  * returns a curve. Examples of curve transformations are {@link !scale} and {@link !translate}.
>  */
> ```

### Other Tags

There are a variety of tags that Typedoc supports. This list can be found [here](https://typedoc.org/documents/Tags.html). When writing your documentation you should use these tags
to the best of your ability to help make your documentation as comprehensive as possible.

> [!INFO] Configuring Supported Tags
> There is an ESLint rule configured to error when you use an unknown tag. By default, the rule includes all tags supported by JSDoc, but Typedoc
> actually supports many more tags intended for customizing documentaton output.
>
> If you want to use a Typedoc supported tag that hasn't been configured for use, you can simply modify the `jsdoc/check-tag-names`
> rule to include your tag.

## Code Samples

You can include "sample" files that are written in Javascript. These files can be used as part of documentation but are not intended to be included during compilation or
used by Source users. Refer to the `csg` bundle for an example of this. Usually, these are contained in a `samples` folder located within the bundle directory.

These files aren't automatically included by Typedoc, but Typedoc does have [a mechanism](https://typedoc.org/documents/External_Documents.html) for including external code. Alternatively, a simple solution
would be to provide a link to the Github folder in which your sample files are contained.

## Custom Typedoc Configuration

`typedoc` options can be specified in the `"typedocOptions"` section of your `tsconfig.json`. Unfortunately, we cannot support dynamic configurations (like those loaded using a Javascript file)
at the moment.

> [!TIP] Fixing the Unexported Warning
>
> One use you might have for customizing your Typedoc configuration is fixing warnings produced by Typedoc:
>
> Since type aliases and custom classes shouldn't be exported, Typedoc will emit warnings telling you that those types aren't being included in the documentation:
>
> ```txt
> [warning (sound)] The comment for letter_name_to_frequency links to "NoteWithOctave|note name" which was resolved but is not included in the documentation. To fix this warning export it or add { "@sourceacademy/bundle-midi": { "NoteWithOctave": "#" }} to the externalSymbolLinkMappings option
> [warning (sound)] The comment for midi_note_to_frequency links to "MIDINote|MIDI note" which was resolved but is not included in the documentation. To fix this warning export it or add { "@sourceacademy/bundle-midi": { "MIDINote": "#" }} to the externalSymbolLinkMappings option
> ```
>
> To fix this, you can mark those entries as intentionally unresolved as described [here](https://typedoc.org/documents/Options.Comments.html#externalsymbollinkmappings) by
> adding the option to the `tsconfig.json` (which is actually the solution suggested in the console):
>
> ```jsonc {11-19}
> // tsconfig for sound bundle
> {
>   "extends": "../tsconfig.json",
>   "include": [
>     "./src"
>   ],
>   "compilerOptions": {
>     "outDir": "./dist",
>     "rootDir": "./src"
>   },
>   "typedocOptions": {
>     "name": "sound",
>     "externalSymbolLinkMappings": {
>       "@sourceacademy/bundle-midi": {
>         "MIDINote": "#",
>         "NoteWithOctave": "#"
>       }
>     }
>   }
> }
> ```
