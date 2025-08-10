---
title: On Pull Request
---

# The Pull Request Workflow

The main Github Action that runs on for each pull request to verify the state of the repository consists of several separate "jobs".

This workflow makes use of `matrix` strategy to run the tasks in parallel where possible.

## 1. `find-packages`

This job executes first, using the [Information Action](./1-actions.md#information-action-infoactionyml). The action returns
all the necessary information for the subsequent jobs to execute their tasks.

> [!INFO]
> The info action runs `git --no-pager diff master [directory]` from a package's root directory to determine if there
> are any changes in the package. Because of this, it is also necessary to run a `git fetch`.

## 2. `libraries`, `bundles` and `tabs`

These three jobs are matrix jobs that run tasks for the individual packages. If the package has changes, then
the job will run tests and `tsc` for the package.

This means that if the package requires `playwright` to run its tests, it will be installed during the init step.

These jobs have the `fail-fast` option set to `false`, so a single job failing doesn't mean that the rest of the jobs
in the workflow get cancelled.

## 3. `devserver`

The `devserver` jobs only executes if there were changes within the dev server. Since it relies on bundles and tabs being
compiled, it does rely on both the `bundles` and the `tabs` jobs to have completed.

## 4. `docserver`

The `docserver` job only executes if there were changes made to the modules library or the docs themselves. It doesn't
deploy the docs here, so it the call to `yarn build` only serves as to way to check that the docs can be generated without errors
like dead links.

## 5. `repo-tasks`

This job consists of checking `yarn constraints` and running ESLint for the entire repository. It doesn't rely on any of the other jobs, so it runs in parallel to all of them.
