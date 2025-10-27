# Yarn

This page is dedicated to explaing how Yarn has been configured to work in this repository.

## Workspaces

Yarn, this repository's package manager, supports a feature called [workspaces](https://yarnpkg.com/features/workspaces#global-scripts), which are a way for packages to refer to one another within the same repository.

This has several benefits:

- **Reduced install size.** Yarn workspaces support focused installs, which means that a single team working on a single bundle or tab won't have to install the entire repository's worth of packages that won't be relevant to them
- **Dependency Management.** If tabs (or other bundles) rely on a specific bundle, Yarn's dependency resolution automatically determines what needs to be rebuilt and in what order.
- **Automatic Worktree Detection.** If so desired, Yarn automatically detects which bundles/tabs have changed with respect to the main git branch and won't rebuild those that haven't.
- **More Configurability:** Each bundle/tab can maintain its own set of dependencies now, separate from other bundles. This allows us to have patches local to a specific bundle (like the `@jscad/modeling` patch for `csg`). Also each bundle/tab can customize its own `tsconfig` etc..

At the root repository, this is defined using the `workspaces` field in `package.json`.

## Yarn Constraints

Yarn also supports a feature known as [constraints](https://yarnpkg.com/features/workspaces#constraints) for workspaces. As of this moment, the feature can be used to ensure that all workspaces within a repository have fields in their `package.json`s set to specific values. We use this feature to ensure that:

### 1. All workspaces have `"type": "module"`

As part of ensuring consistency, everything in this repository has been designed to use ESM first and to move away from legacy reliance on CommonJS modules.

### 2. Dependencies, if shared, have the correct versions

Tabs, for example, should all be using the same versions of `react` and `react-dom`: the one in use by the frontend. If a dependency is specified in the root `package.json`, then the constraints file
requires that all child workspaces use the version of that dependency.

For example, the root package specifies `react@^18.3.1` as a dependency, so all workspaces that require React must also use that version spec.

This validation is not carried out across child workspaces, however. Two different bundles could use two different versions of the same package. This should not cause an issue **unless** the bundles are somehow dependent on each other.

Furthermore, if you are depending on a package from within the modules repository, you should be using the `workspace:^` version specification as the packages within this repository
are not intended to be published to NPM so a regular version specification would be invalid.

### 3. `js-slang` has no resolution override

Yarn allows users to override the resolution of packages via the [`resolutions`](https://yarnpkg.com/configuration/manifest#resolutions) field. There are several reasons to do this,
but the most common reason a resolution would be used in this repository would be to point Yarn to a local copy of `js-slang`.

Of course, the final production versions of your code shouldn't be relying on a local copy of `js-slang` (that wouldn't exist anyway), so the constraint is enforced here to
make sure that `js-slang` isn't incorrectly resolved.

### 4. `repotools` doesn't have another local dependency

The `repotools` package is designed to be the 'root' for all the tooling in the repository. If it were to depend on another package within this repository, we would create
a dependency loop that Yarn would not be able to resolve. So we enforce the constraint that the `@sourceacademy/modules-repotools` package is not allowed to depend on any
other package within this repository.

### 5. Vitest related dependencies should have the same version as Vitest

Aside from `vitest-browser-react` and `@vitest/eslint-plugin`, all Vitest packages should have the same version range
as Vitest throughout the repository.

## Parallel Execution of Scripts

Using the various options of the `yarn workspaces foreach` command, you can execute multiple tasks in parallel, which is how many of the commands in the root repository have been set up.

The `-t` option runs the scripts in topological order, which means you don't have to manually figure out which packages have to be built before others; Yarn figures it out for you.

::: details ESLint out of memory?
For some reason when I migrated this repository over to Yarn workspaces, I kept finding that linting all the bundles at once in parallel
would cause NodeJS to exceed its default memory limit of 4906MB. I guess if you wanted to run linting for all bundles in parallel you could
just run NodeJS with `--max-old-space-size`, but I just found that limiting the number of jobs running in parallel using `-j` to 5 was
sufficient to get around this issue.
:::
