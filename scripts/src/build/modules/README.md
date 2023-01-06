# Source Academy Module Module Build System
This folder contains all the code required to build bundles and tabs.

## Why build?
To run module code, the frontend would have to have all the dependencies of every single module, which would make building the frontend tedious and bloated.

Building each module involves inlining all its dependencies, removing the need for the frontend to load those dependencies.

## Build Pipeline
Firstly, `tsc` is run on the code to ensure that there are no type errors. This is necessary because `esbuild` does not perform type checking in favour of speed.

Both bundles and tabs are then fed through [`esbuild`](https://esbuild.github.io), a high speed Javascript and Typescript bundler.

Here are the options used:
```ts
bundle: true,
external: ['react', 'react-dom', 'js-slang/moduleHelpers'],
format: 'iife',
globalName: 'module',
inject: [`${cjsDirname(import.meta.url)}/import-shim.js`],
loader: {
  '.ts': 'ts',
  '.tsx': 'tsx',
},
metafile: true,
platform: 'browser',
target: 'es6',
write: false,
```

### `esbuild` Options
#### `bundle: true`
Tell `esbuild` to bundle the code into a single file.

#### `external`
Because the frontend is built using React, it is unnecessary to bundle React with the code for tabs. Similarly, `js-slang/moduleHelpers` is an import provided by `js-slang` at runtime, so it is not bundled with the code for bundles.\
If you have any dependencies that are provided at runtime, use this option to externalize it. You will need to indicate these imports elsewhere.

Refer to the output step to see how to use externals.
#### `format: 'iife'`
Tell `esbuild` to output the code as an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE).

#### `globalName: 'module'`
By default, `esbuild`'s IIFE output doesn't return its exports:
```js
(function() {
  var exports = {}
  exports.add_one = function(x) {
    return x + 1;
  }
})()
```
By specifying a  `globalName`, the generated code instead becomes:
```js
var module = (function() {
  var exports = {}
  exports.add_one = function(x) {
    return x + 1;
  }
  return exports;
})()
```
It is then possible to extract the inner IIFE and use it to retreive the exports.
#### `inject: [\`${cjsDirname(import.meta.url)}/import-shim.js\`]`
Module code that requires constructs such as `process.env` which are unavailable in the browser environment will cause the Source program to crash.

The inject parameter specifies a Javascript file that exports all the identifiers you wish to replace. For example, to provide `process.env`:
```ts
// import-shim.ts
export const process = {
  env: {
    NODE_ENV: 'production'
  }
}
```
#### `loader`
Tell `esbuild` how to load source files.

#### `platform: 'browser`, `target: 'es6'`
Tell `esbuild` that we are bundling for the browser, and that we need to compile code down to the ES6 standard, which is supported by most browsers.

#### `metafile: true, write: false`
`metafile` makes `esbuild` output extra information about the code that it has built, which is used to finish building the bundle or tab.

`write: false` causes `esbuild` to its compiled code into memory instead of to disk, which is necessary to finish building the bundle or tab.

### Output Step
The IIFE output produced by `esbuild` is not ready to be evaluated by `js-slang`. There are several transforms that still need to be peformed. This step is performed by parsing each IIFE into an AST using `acorn`, and then modifying that AST before using `astring` to generate the code that is actually written to disk.

The first step is to extract the IIFE from the generated code:
```js
var module = (function(){
  var exports = {}
  exports.add_one = function(x) {
    return x + 1;
  }

  return exports;
})()
```
gets transformed to
```js
function() {
  var exports = {}
  exports.add_one = function(x) {
    return x + 1;
  }

  return exports;
}
```
#### Bundles
Because bundles are passed the context by `js-slang`. To facilitate this, a parameter is added and a require function is added.

```js
function(moduleHelpers) {
  function require(x) {
    const result = ({
      "js-slang/moduleHelpers": moduleHelpers
    })[x];
    if (result === undefined) throw new Error(`Unknown import "${x}"!`); else return result;
  }
  var exports = {}
  exports.add_one = function(x) {
    return x + 1;
  }

  return exports;
}
```
