# Compiling a Bundle
This page contains information on compiling bundles, both for consumption by `js-slang` as well as other bundles.

> [!WARNING]
> The build tools automatically ignore files under a `__tests__` directory. Such files are considered
> test files and will not be included in the compiled output.

## For `js-slang`
In its raw ESM format, the bundle is unsuitable for use with `js-slang`. It is thus necessary to compile your written Typescript into the format needed by `js-slang`.

Run the following command from within your bundle directory.

```sh
yarn build
```

Note that running this command will **NOT** perform typechecking. If you wish to perform typechecking, use the following command:
```sh
yarn build --tsc
```

This will run the TypeScript compiler before compiling your bundle. If there are any type errors, it will be displayed in the command line
and your bundle will not be compiled.

The output for your bundle will be placed at `/build/bundles/[your_bundle_name].js`.

## For Other Bundles
A Source Bundle may use another Source Bundle as a dependency. As an example, the `plotly` bundle relies on the `curve` bundle:
```ts {2,3}
// plotly/src/curve_functions.ts
import { x_of, y_of, z_of, r_of, g_of, b_of } from '@sourceacademy/bundle-curve';
import type { Curve } from '@sourceacademy/bundle-curve/curves_webgl';
import Plotly, { type Data, type Layout } from 'plotly.js-dist';
import { CurvePlot } from './plotly';
```

If you intend for your bundle to be consumed from other bundles, do the following:

### 1. Ensure that your `tsconfig.json` is properly configured
```json
{
  "compilerOptions" {
    "outDir": "./dist", // Make sure outDir is specified
    "noEmit": false,    // noEmit needs to be false
    "declaration": true // declaration needs to be true
  }
}
```

### 2. Ensure that your `package.json` is configured correctly
```json
{
  "name": "@sourceacademy/bundle-curve",
  "type": "module",
  "exports": {
    ".": "./dist/index.js",
    "./*": "./dist/*.js"
  },
  "scripts": {
    "prepare": "yarn buildtools tsc"
  }
}
```
Refer to [this page](https://nodejs.org/api/packages.html#package-entry-points) for more information on how to configure your package exports.

::: details The `prepare` script
As per NPM [docs](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts), when the package is being installed locally the
`prepare` script is executed. By providing this script, anyone else that adds your bundle as a dependency for their code won't have to
manually build your bundle.
:::

### 3. Run `tsc`
If necessary, run `yarn tsc` to produce Javascript and Typescript declaration files.
