---
title: Custom Actions
---

# Custom Github Actions

Github Actions does provide us the ability to write our own custom actions that can be integrated with the rest of the pipeline. This repository
makes use of two:

- Initializer Action
- Information Action

Creating custom actions is detailed [here](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax). The convention for each action is have its metadata file (`action.yml`) in the same directory as its source code (if necessary).

## Information Action (`info/action.yml`)

The information action retrieves information about each package present in the repository, namely:

- Has this package changed relative to the master branch?
- Name of the package
- Directory of the package
- Does the package require `playwright`?

In the case of bundles or tabs, it also retrieves the name of the bundle or tab.

In case of changes to the lockfile, it also determines which packages need to be rebuilt. This can happen when dependencies of dependencies change, so no change is present in the package's source code itself, but the lockfile itself has changed.

More detail about detecting changes can be found in [this section](./4-changes.md).

This information is used by both the initializer action and the workflows to determine the what tasks need to be executed.

## Initializer Action (`init/action.yml`)

The initializer action combines the initialization steps that are necessary for each package:

1. Enable `corepack`
2. Install dependencies for that workspace (using `yarn workspaces focus`)
3. Install playwright if necessary (using `yarn playwright install --with-deps`)

> [!INFO] What about actions/checkout?
> Theoretically this action should also include `actions/checkout` since this action is repeated across
> the different packages. However, the code for this action sits in the repository, so for Github to be able to execute
> the init action, it needs to first obtain its code, which means the repository must be checked out before this action
> can run.
>
> Thus, the initializer action has to run _after_ `actions/checkout` has completed and so it has to be a separate step.

## Load Artifacts Action (`load-artifacts/action.yml`)

When the CI executes, it will build any tab that has changes relative to the master branch. If the devserver also has
changes, then its tests will run. Since the devserver requires the compiled version of all tabs, we must build all
tabs before running the devserver's tests.

Since some tabs might already have been built, there is no reason for us to go through the lengthy process of
installing those tabs' dependencies and rebuilding them. Instead, if we save the built tabs as workflow artifacts,
we can restore those tabs before running the devserver's tasks. All that remains then is to build the tabs that
haven't already been built.

This action does this exact job: figuring out which tabs have already been built successfully and thus can be downloaded
and which tabs need to be built from scratch.
