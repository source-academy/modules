# Building for Bundles and Tabs

## Why Bundle?

To run module code, `js-slang` would have to have all the dependencies of every single module, which would make building it tedious and bloated and also introduce an undesirable dependency between modules and js-slang. Instead, Source Modules are bundled before use.

Bundling refers to the process of combining all of a module's dependencies into a single file. You can refer to [other projects](https://nextjs.org/learn/foundations/how-nextjs-works/bundling) that require bundling for more information.\
Dependencies available at runtime aren't bundled and are handled differently (refer to later sections for more information)

## Bundlers

Currently, there are several bundlers available such as RollupJS, Babel and Webpack. These bundlers trade speed for high configurability, giving the user a wide range of configuration options and plugins to customize the bundling process. Most of these options are unnecessary for bundling source modules.\
[`esbuild`](https://esbuild.github.io) is a Javascript bundler that trades configurability for speed. It is magnitudes faster than most other bundlers and suits the modules repository just fine. We use it to transpile module code from Typescript to Javascript and perform bundling.

## How Source Modules are Bundled

Bundles and tabs are transpiled with esbuild using the following common options set:

<<< ../../../../lib/buildtools/src/build/modules/commons.ts#esbuildOptions

This converts each bundle and tab into an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). Here is the `curve` bundle passed through `esbuild`:

```js
// All of the code within the curve bundle is combined into a single file
// build/bundles/curve.js
var globalName = (() => {
  // Code from mat4
  function create() { /* implemntation details */ }
  function clone(a) { /* implemntation details */ }
  function copy(out, a) { /* implemntation details */ }
  // ... and other implementation details

  // The module's exports are returned as a single object
  return {
    draw_connected_2d,
    make_point,
    // etc...
  };
})();
```

## Options Explained

### `bundle: true`

Tell `esbuild` to bundle the code into a single file.

### `external`

This option is used to mark which packages not to include when bundling. This is useful for dependencies that are available at runtime (e.g The Frontend provides React).

### `format: 'iife'`

Tell `esbuild` to output the code as an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

### `globalName: 'module'`

By default, `esbuild`'s IIFE output doesn't return its exports:

```js
(function () {
  var exports = {};
  exports.add_one = function (x) {
    return x + 1;
  };
})();
```

By specifying a  `globalName`, the generated code instead becomes:

```js
var module = (function () {
  var exports = {};
  exports.add_one = function (x) {
    return x + 1;
  };
  return exports;
})();
```

It is then possible to extract the inner IIFE and use it to retrieve the exports.

### `define`

Module code that requires constructs such as `process.env` which are unavailable in the browser environment will cause the Source program to crash.

The `define` option tells esbuild to replace instances with `process.env` with `{ NODE_ENV; 'production' }`, making that environment variable available at runtime

Similarly, because we are bundling for the browser, it becomes necessary to define the NodeJS `global` as the browser `globalThis`.

### `platform: 'browser`, `target: 'es6'`

Tell `esbuild` that we are bundling for the browser, and that we need to compile code down to the ES6 standard, which is the Javascript standard targeted by Source.

### `write: false`

`write: false` causes `esbuild` to output its compiled code into memory instead of to disk, which is necessary to finish building the bundle or tab.

## After Esbuild

After esbuild bundling, both bundles and tabs are parsed using [`acorn`](https://github.com/acornjs/acorn) to produce an AST. Esbuild will produce an IIFE that looks like the following:

```js
var module = (function () {
  var exports = {};
  exports.add_one = function (x) {
    return x + 1;
  };

  return exports;
})();
```

The AST is then transformed by the `outputBundleOrTab` function, which produces output that looks like this:

```js
export default require => {
  var exports = {};
  exports.add_one = function (x) {
    return x + 1;
  };

  return exports;
};
```

This is what is finally written to the output folders.

Consumers of this compiled version of bundles and tabs can retrieve the IIFE by using the default export.  When bundles and tabs are loaded, the IIFE is called with a function that simulates the `require()` function
in CommonJS to provide the dependencies marked as external (that have to be provided at runtime).

## `js-slang/context`

`js-slang/context` is an import provided at runtime by `js-slang` that returns the context in use for evaluation. It is not an actual import that's available
at compile time, which means that typings have to be provided for it.

This is achieved using a Typescript declaration file.

## Summary of Build Process

```mermaid
graph LR;
  A[Bundle Resolution]
  B[Esbuild Bundling]
  C[AST Manipulation]
  D[Write to Output]

  A --> B --> C --> D
```
