# Overview of Bundles

Similar to regular Javascript modules, Source allows developers to export functions and constants to users for importing into their programs.

For example, the `binary_tree` module may want to provide an abstraction for Source programs to interact with the Binary Tree data structure. Thus, the `binary_tree` module would expose functions such as `make_tree`, `left_branch` and `right_branch` to be used in Source programs. 

## Bundle Directory Structure Overview

The typical bundle structure for a bundle is shown below. Each section will have its own explanation.
```txt
bundle_name             // Name of the root folder is the name of the bundle
├── src
│   ├── __tests__       // Folder containing unit tests
│   │   └── index.ts    // File containing unit tests
│   ├── index.ts        // Entry Point
│   ├── functions.ts    // Example file
│   └── ....            // Other files your bundle may use
├── package.json        // Package Manifest
├── manifest.json       // Bundle Manifest
└── tsconfig.json       // Typescript Configuration
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
import { make_point } from 'curve' // No Error
import { createDrawFunction } from 'curve' // Will throw an error
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
> ```ts
> import { whatever } from 'bundle_name';
> ```
> However, people consuming your bundle from regular Javascript and Typescript need to use the full (scoped) package name:
> ```ts
> import { whatever } from '@sourceacademy/bundle-bundle_name';
> ```

### `manifest.json`
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
    "outDir": "./dist"
  },
  "typedocOptions": {
    "name": "curve"
  }
}
```
In general, there should not be a need for you to modify this file.  A full explanation on how to use `tsconfig.json` can be found [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). Note that the `typedocOptions` field is a custom field used by `typedoc` for its configuration. Refer to [here](https://typedoc.org/documents/Options.Configuration.html#compileroptions) for more information.

> [!WARNING]
> You should not remove or modify the `typedocOptions` section from your `tsconfig.json` unless you provide the name of your bundle to Typedoc via its other configuration methods. Generating documentation for your bundle
> requires that the name of your bundle be set correctly.

::: details Missing types for dependencies and overriding `tsconfig.json`
Sometimes, your bundle might depend on packages that have published their types differently. For example, the `communication` bundle requires `mqtt`:
```ts
import { connect, type MqttClient, type QoS } from 'mqtt/dist/mqtt';
// Need to use "mqtt/dist/mqtt" as "mqtt" requires global, which SA's compiler does not define.

export const STATE_CONNECTED = 'Connected';
export const STATE_DISCONNECTED = 'Disconnected';
export const STATE_RECONNECTING = 'Reconnecting';
export const STATE_OFFLINE = 'Offline';

// ...other things
```
The `mqtt` dependency however, is specified as such in `package.json`:
```json
{
  "dependencies": {
    "mqtt": "^4.3.7",
    "uniqid": "^5.4.0"
  }
}
```
The helpful comment below the import explains the discrepancy. Without further configuration, we find that Typescript is unable to find the types for the `mqtt/dist/mqtt` package:
![](./mqtt-types.png)

`tsconfig` does provide a way for you to tell Typescript where to look for types: using either the `paths` or `types` field. The `tsconfig` for the `communication` bundle looks like this:

<<< ../../../../../src/bundles/communication/tsconfig.json

The `paths` compiler option has been set to tell Typescript where to find the types for `mqtt/dist/mqtt`. Because of the way `tsconfig.json` file inheritance works, if you override a configuration option in a child `tsconfig`,
you'll need to specify the options from the parent configuration again (hence the `js-slang/context` path).

In other words, if you need to modify `tsconfig.json`, make sure to include the corresponding options inherited from the parent `tsconfig.json`.
:::

