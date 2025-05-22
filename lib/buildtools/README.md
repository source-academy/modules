# Source Academy Buildtools

## Testing
By default, Jest as a testing framework transforms everything from ESM to CJS before running tests. Unfortunately, the build tools are written in and compiled to ESM, which means
that certain features won't work properly if everything was written in pure ESM.

`__dirname` is only available in CJS modules, but Node makes this availble in ESM using `import.meta.dirname`. `import.meta` is not available in CJS though, which means that Jest
won't be able to run tests.
Thus, we use `__dirname` in the source code but have `esbuild` replace it with `import.meta.dirname` using its `define` feature during compilation. At the same time
using `__dirname` means that Jest won't complain about using ESM features in CJS.