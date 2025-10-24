# Overview of Bundles

Similar to regular Javascript modules, Source allows developers to export functions and constants to users for importing into their programs.

For example, the `binary_tree` module may want to provide an abstraction for Source programs to interact with the Binary Tree data structure. Thus, the `binary_tree` module would expose functions such as `make_tree`, `left_branch` and `right_branch` to be used in Source programs.

## Bundle Directory Structure Overview

The typical bundle structure for a bundle is shown below. Each section will have its own explanation.

```dirtree
name: bundle_name
children:
  - name: src
    children:
    - name: __tests__
      comment: Folder containing unit tests
    - name: index.ts
      comment: Entry point
    - name: functions.ts
      comment: Example file
  - name: package.json
    comment: Package Manifest; Used by Yarn
  - name: manifest.json
    comment: Bundle Manifest
  - name: tsconfig.json
    comment: Typescript Configuration
```

> [!NOTE]
> The name of the root folder will be the name of the bundle

> [!WARNING]
> A bundle folder must have both `manifest.json` AND `package.json` to be considered a bundle.

## `src/index.ts` (Bundle Entry Point)

Only functions that are exported by the module will be made available to users. Let us look at an example from the `curve` module.

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

Note that `curve/functions.ts` exports both `createDrawFunction` and `make_point`.

```ts
// curve/index.ts
export { make_point } from './functions';
```

However, only `make_point` is exported at the bundle's entry point however `createDrawFunction` is not, so cadets will not be able to access it, identical to how ES modules behave.

```js
// User's Source program
import { make_point } from 'curve'; // No Error
import { createDrawFunction } from 'curve'; // Will throw an error
```

::: details An aside about exports
Though Javascript supports three types of exports, only regular exports are currently in use. Cadets currently cannot use default imports (`import something from 'somewhere'`) or namespace imports (`import * as something from 'somewhere'`).
More information about how `js-slang` handles imports and exports can be found [here](https://github.com/source-academy/js-slang/wiki/Local-Module-Import-&-Export).

It is not recommended that you use default exports in your code as default exports are a Javascript feature, which other languages (like Python) may not be able to take advantage of.
:::

## `package.json`

The `package.json` file follows the same format as your typical `package.json` used with the likes of `npm` or `yarn`. If you use the template creation command, it should already have been created for you.

```jsonc
{
  "name": "@sourceacademy/bundle-curve", // Package name
  "version": "1.0.0", // Your bundle version
  "dependencies": {
    // Dependencies that are required at runtime
  },
  "devDependencies": {
    // Dependencies that are required only for development
  }
}
```

You can find more information about each of the fields and what they mean [here](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies).

> [!WARNING] Bundle vs Package Name
> The `name` field in `package.json` is the package name and must follow the format `@sourceacademy/bundle-[your bundle name]`.
> The bundle name is what users will actually use to import your bundle from within Source code:
>
> ```ts
> import { whatever } from 'bundle_name';
> ```
>
> However, people consuming your bundle from regular Javascript and Typescript need to use the full (scoped) package name:
>
> ```ts
> import { whatever } from '@sourceacademy/bundle-bundle_name';
> ```

## `manifest.json`

`manifest.json` contains the information required by `js-slang` to load your bundle.

```jsonc
{
  "tabs": ["Curve"], // String array of the names of the tabs that will be loaded alongside your bundle
  "requires": 1      // The minimum Source chapter required for this module (optional)
}
```

The presence of this file in your root folder is what allows the build tools to determine that the folder contains a bundle. If this file is not present, your folder will be ignored.

::: details The `requires` field
Your bundle may rely on features that are only present in later Source Chapters. For example, streams are only available from Source 3 onwards. If your bundle makes uses of streams, then you can use `requires: 3` to specify that your bundle can only be loaded when running Source 3 and beyond.
:::

>[!TIP] Verifying your manifest
> You can use the `buildtools list bundle` command to check that your bundle can be properly detected and has the correct format.

## `tsconfig.json`

This file controls the behaviour of Typescript. By default, it should look like this:

```json
{
  "extends": "../tsconfig.json",
  "include": [
    "./src"
  ],
  "compilerOptions": {
    "outDir": "./dist",
    "noEmit": true
  },
  "typedocOptions": {
    "name": "curve"
  }
}
```

Note that the `include` option includes both source code and unit tests. This is so that your unit tests can be type checked and linted properly.

In general, there should not be a need for you to modify this file.  A full explanation on how to use `tsconfig.json` can be found [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). Note that the `typedocOptions` field is a custom field used by `typedoc` for its configuration. Refer to [here](https://typedoc.org/documents/Options.Configuration.html#compileroptions) for more information.

> [!WARNING]
> You should not remove or modify the `typedocOptions` section from your `tsconfig.json` unless you provide the name of your bundle to Typedoc via its other configuration methods. Generating documentation for your bundle
> requires that the name of your bundle be set correctly.

> [!INFO] Why both noEmit and outDir?
> Most of the time, the Typescript compiler should be run via the buildtools, i.e `yarn buildtools tsc` or `yarn buildtools build --tsc`.
> The buildtools automatically include unit tests for type checking but exclude them from compilation to Javascript.
>
> However, if you accidentally run the Typescript compiler directly, `tsc` will compile the test files too
> (since `tsconfig.json` should be configured to include them), which is undesirable.
> Hence, `noEmit` is set to `true` to prevent this. The buildtools automatically override this value when executed.
>
> The alternative would be to have two different `tsconfig.json` files: one for type checking and one for compilation, but that would just
> add to the clutter of files throughout the repository.
