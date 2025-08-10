# General Design of the Build Tools

## Path Resolution

The build tools are designed to be written in Typescript, then compiled and bundled by `esbuild` into a single minified Javascript file `dist/index.js`. This means relative paths used during runtime need to be written in such a way that they account for the path of the executable file.

For example, the template script needs to copy the templates from the `dist/templates` folder. So the call to `fs.cp` is written relative to `import.meta.dirname` instead of
hardcoding a relative path:

```ts
// lib/buildtools/src/templates/bundle.ts
await fs.cp(`${import.meta.dirname}/templates/bundle`, bundleDestination, { recursive: true });
```

When `dist/index.js` is executed, `import.meta.dirname` refers to `lib/buildtools/dist`, so the above path becomes `lib/buildtools/dist/templates/bundle`, which is the actual location of where the template files are located.

On the other hand, relative module imports that are bundled during the compilation process don't need to be changed. The template script imports the root package json to
determine the versions of dependencies to use:

```ts
// lib/buildtools/src/templates/bundle.ts
import _package from '../../../../package.json' with { type: 'json' };

// extract typescript version
const { dependencies: { typescript: typescriptVersion } } = _package
```

Although the resolved module path refers to a path outside of the buildtools folder, during compilation, `esbuild` actually
embeds the entire JSON file into `dist/index.js`, thus removing the import altogether:

```ts
// ../../package.json
var package_default = {
  private: true,
  name: '@sourceacademy/modules',
  version: '1.0.0',
  repository: 'https://github.com/source-academy/modules.git',
  license: 'Apache-2.0',
  // other things...
};
const typescriptVersion = package_default.devDependencies.typescript;
```

## `getGitRoot.ts`

In general, the outputs of compiling bundles and tabs are placed relative to the root of the Git repository (the `/build`) folder. Since the buildtools
need to be able to be executed from any of the bundles' and tabs' directories and subdirectories (and in fact any directory within the repository), it is crucial
that the build tools are able to obtain a path to the root of the repository.

The path to the root of the repository can be obtained by running the Git command:

```sh
git rev-parse --show-toplevel
```

To get run this command from NodeJS and get the output of this command programmatically, we use [`execFile`](https://nodejs.org/api/child_process.html#child_processexecfilefile-args-options-callback) from NodeJS's `child_process` library:

```ts
function rawGetGitRoot() {
  return new Promise<string>((resolve, reject) => {
    execFile('git', ['rev-parse', '--show-toplevel'], (err, stdout, stderr) => {
      const possibleError = err || stderr;
      if (possibleError) {
        reject(possibleError);
      }

      resolve(stdout.trim());
    });
  });
}
```

This is guaranteed to work, since the user should have Git present on their system (otherwise how did they get this git repo?)

By abstracting this functionality into a separate module, it is simple to change the paths at which everything is defined (such as where the directory containing bundles is found). In particular,
by mocking this module, we can run the buildtools on mock bundles and tabs with ease.

## The `__test_mocks__` Directory

This directory contains 2 mock bundles and 2 mock tabs, intended for testing the output of the buildtools. In `__mocks__`, there is a mock implementation of `getGitRoot.ts` that returns
file paths relative to this directory instead of the actual Git repository, causing the buildtools to look within this directory for bundles and tabs instead of the actual directories
they are located within.

## Unit Testing

### Test Files

Only files that match the pattern `**/__tests__/**/*.test.ts` are considered test files. This allows us to create utility files that are only used for testing purposes, but won't
cause `vitest` to throw an error because they don't contain any tests within them.

### Global Test Configuration

The buildtools have a `vitest` setup file configured to apply some global mocks:

1. Mock the `fs` library's output functions to make it sure the tests never actually write to the file system
1. Mock `typescript` so that it too does not output any files to the file system, even with `noEmit: false`
1. Mock `chalk` so that the colour formatting characters are removed from console output
1. Mock `process.exit` so that it throws an error that we can catch and observe to assert that it was called

The setup file also provides two extra matchers that are intended for use with `commander` commands. The typings for these matchers
are included in `vitest.d.ts`.

## Path Manipulation

The buildtools are designed to work in both Windows and Unix environments. This means that a lot of the path manipulation required (like resolution or concatenation)
need to be done in a platform agnostic way where possible. NodeJS provides two versions of its `path` library: `path.win32` and `path.posix` and switches between the
versions depending on what it detects the OS to be.

This is why for the most part, it is preferable to use the `path` functions rather than string manipulation to manipulate file paths:

```js
import pathlib from 'path';
const finalPath = pathlib.join('1', '2', '3');
// vs
const finalPath = '1/2/3';
```

However, it is important to note that some tooling (like Typedoc) requires Posix style paths. In that case, it becomes necessary to convert all paths to Posix
style paths before passing it to Typedoc.

Many of the unit tests have also been written in this way to account for the different behaviours between Windows and Posix style paths.
