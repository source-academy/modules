# Source Academy Module Documentation Build System

This folder contains all the code relating to building the two types of documentation used by Source, which are the jsons and the HTML documentation. Both are built using the [`typedoc`](typedoc.org) tool.

By reading comments and type annotations, `typedoc` is able to generate both human readable documentation and documentation in the form of JSON.

By default, `typedoc` does type checking for the code, similar to `tsc`. It has been turned off as more often then not, `tsc` will be run before `typedoc`, making the type checking performed by `typedoc` extraneous. This does mean that if the build script is called without running `tsc`, there is a possibility that type errors will cause `typedoc` to crash.

## Commands
- `build docs`: Build both json and html documentation
- `build html`: Build only html documentation
- `build jsons` Build only json documentation

## Writing Documentation
`typedoc` reads both Typescript type annotations, as well as JSDOC style comments. It will build documentation for all functions and constants exported by the particular module.

Let us look at an example from the `curve` module.
```ts
// curve/functions.ts
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

/**
 * Use this function to create the various `draw_connected` functions
 */ 
export function createDrawFunction(
  scaleMode: ScaleMode,
  drawMode: DrawMode,
  space: CurveSpace,
  isFullView: boolean,
): (numPoints: number) => RenderFunction {
  // implementation hidden...
}
```
Both functions have their documentation written above in Markdown. Even though `createDrawFunction` is exported from `functions.ts`, it is not exported by `curve/index.ts`, whereas `make_point` is. Thus, `typedoc` will only generate documentation for `make_point` and not `createDrawFunction`.



```ts
// curve/index.ts
export { make_point } from './functions.ts';
```
Since the `curve` bundle exports the `make_point` function, `typedoc` will generate documentation for it. 

## Running the build command
To build documentation ONLY, run `yarn build docs`. You can also use the `-m` parameter should you wish to build the documentation for specific bundles.

## HTML Documentation
The human readable documentation resides in the `build/documentation` folder. You can view its output [here](https://source-academy.github.io/modules). Correspondingly, the code that builds the HTML documentation can be found in `html.ts`.

NOTE: When `-m` is specified, HTML documentation is not built. This is because `typedoc` will only build the HTML documentation for the modules you have given, leading to incomplete documentation.

## JSON Documentation

To provide the frontend with documentation that can be directly displayed to the user, each module has its own json file in the `jsons` folder containing the formatted descriptions of exported variables.
Using the example code above, here is what the JSON documentation looks like for the actual `curve` bundle:
```json
{
  "b_of": "<div><h4>b_of(pt: Point) → {number}</h4><div class=\"description\"><p>Retrieves the blue component of a given Point.</p></div></div>",
  "make_point": "<div><h4>make_point(x: number, y: number) → {Point}</h4><div class=\"description\"><p>Makes a Point with given x and y coordinates.</p></div></div>",
  // ... and other functions and constants
}
```

When building the json documentation for a bundle, the following steps are taken:
1. From `typedoc`'s output, extract the [project](https://typedoc.org/api/classes/ProjectReflection.html) corresponding to the bundle.
1. For each exported variable, run it through a converter to convert the `typedoc` project into a single string:
    - For constants, their names and types are extracted
    - For functions, their name, the names and types of each parameter, and return types are extracted.\
    The descriptions of both functions are constants are also included, but first they are passed through a Markdown to HTML converter called [drawdown](https://github.com/adamvleggett/drawdown), included in this project as `drawdown.ts`
3. The code then converts it to the HTML format expected by the frontend
3. All the processed strings then get written to a json file in the jsons folder.

If no documentation could be found, or there was an error parsing the documented code, the system will still output jsons, just with warnings.\
Code for building each json is found in `json.ts`.