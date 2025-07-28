# Working with the Build Tools
This page contains the instructions required for working with the build tools' source code.

## Installing Dependencies for Build Tools
If you haven't already, follow the instructions [here](/modules/1-getting-started/2-start) to install NodeJS and Yarn.

Running the command below will install the dependencies for **only** the build tools:

```sh
yarn workspaces focus @sourceacademy/modules-buildtools
```

## Compiling the Build Tools

Compiling the build tools is as simple as running `yarn build`. This by default produces a minified Javascript file, which is not very conducive to debugging. If necessary
you can run `yarn build --dev` instead to produce a non-minified build.

For the projects that are supposed to be bundled into a single file using `esbuild`, the package `@sourceacademy/lib-compiler` wraps `esbuild` and `commander` to create a
easy to use compiler.

## Testing
The build tools come with a comprehensive suite of tests. If you are planning to contribute, please write tests to cover your new/modified functionality.
