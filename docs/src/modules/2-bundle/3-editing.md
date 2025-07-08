# Editing an Existing Bundle
This page contains instructions for modifying an existing bundle. If you are creating a new bundle from scratch, refer to [these](./2-creating/2-creating) instructions instead.

## Installing Dependencies
To install **only** the dependencies required by the bundle you are modifying, use the command below:

```sh
yarn workspaces focus @sourceacademy/bundle-[desired bundle]
```

## Adding Dependencies
Your bundle may need other Javascript packages. To add a dependency to your bundle, run the command below:
```sh
yarn add [dependency]
```

If the dependency does not need to be present during runtime, then use:
```sh
yarn add --dev [dependency]
```
This adds the dependency to `devDependencies` instead.

> [!WARNING]
> You should only run this command in the directory of your bundle. Otherwise, the dependency will end up being added to the
> root repository.

> [!NOTE]
> There are certain dependencies that are common to all bundles (like `react`). When adding such a dependency, remember to add the exact version
> specified in the root repository `package.json`:
> ```sh
> yarn add react@^18.3.1
> ```
> You can also use the command `yarn constraints`  to check if you have incorrectly specified the version of a dependency.

> [!NOTE]
> When adding dependencies that originate from the repository (e.g `@sourceacademy/modules-lib`), use `workspace:^` as the given version:
> ```sh
> yarn add @sourceacademy/modules-lib@workspace:^
> ```

## Bundle Conventions
To ensure that bundles conform to the different Source language specifications, there are a few rules that bundles need to abide by.
Refer to [this list](./4-conventions/index) for more information.

## Common Modules Library
There are common functions such as `hexToColor` available in the Common Modules Library. You can make use of these functions
instead of implementing your own versions of them.

## Adding Unit Tests
Where possible, you should add unit tests to your bundle. Refer to [this](/modules/4-advanced/testing) page for instructions.
