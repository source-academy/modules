---
title: Custom Actions
---

# Custom Github Actions

Github Actions does provide us the ability to write our own custom actions that can be integrated with the rest of the pipeline. This repository
makes use of two:

- Initializer Action
- Information Action

Creating custom actions is detailed [here](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax). The convention for each action is have its metadata file (`action.yml`) in the same
directory as its source code (if necessary).

## Information Action (`info/action.yml`)

The information action retrieves information about each package present in the repository, namely:

- Has this package changed relative to the master branch?
- Name of the package
- Directory of the package
- Does the package require `playwright`?

In the case of bundles or tabs, it also retrieves the name of the bundle or tab.

This information is used by both the initializer action and the workflows to determine the what tasks need to be executed.

## Initializer Action (`init/action.yml`)

The initializer action combines the initialization steps that are necessary for each package:

1. Enable `corepack`
2. Install dependencies for that workspace (using `yarn workspaces focus`)
3. Install playwright if necessary (using `yarn playwright install --with-deps`)

>[!INFO]
> Though theoretically this action should also include `actions/checkout` since that action is repeated across
> the different packages, because the initializer action is a custom action, the code for the action needs to be
> checked out before this action can be run.
>
> Thus, the initializer action has to run _after_ `actions/checkout` has completed and so it has to be a separate step.
