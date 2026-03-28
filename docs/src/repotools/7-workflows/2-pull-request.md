---
title: On Pull Request
---

# The Pull Request Workflow

The main Github Action that runs on for each pull request to verify the state of the repository consists of several separate "jobs".

This workflow makes use of `matrix` strategy to run the tasks in parallel where possible.

## 1. `find-packages`

This job executes first, using the [Information Action](./1-actions.md#information-action-infoactionyml). The action returns all the necessary information for the subsequent jobs to execute their tasks.

> [!INFO]
> The info action runs `git --no-pager diff master [directory]` from a package's root directory to determine if there
> are any changes in the package. Because of this, it is also necessary to run a `git fetch`.

This job does find all the packages within the repository and writes their information to the Github Actions summary. However, it will only output packages
that have changes. This is so that when the following matrix jobs execute, we avoid creating jobs that basically require a single runner to be spun up just
for it to determine that the job need not execute.

## 2. `libraries`, `bundles` and `tabs`

These three jobs are matrix jobs that run tasks for the individual packages. The job will run tests and `tsc` for the package.

This means that if the package requires `playwright` to run its tests, it will be installed during the init step.

These jobs have the `fail-fast` option set to `false`, so a single job failing doesn't mean that the rest of the jobs in the workflow get cancelled.

For libraries in particular, the job is run with both the `ubuntu-latest` and `windows-latest` OSes. This makes sure that our libraries are compatibile with both Windows and POSIX-Compliant operating systems.

## 3. `devserver`

The `devserver` jobs only executes if there were changes within the dev server. Since it relies on bundles and tabs being compiled, it does rely on both the `bundles` and the `tabs` jobs to have completed.

Because the there might not have been any bundles or tabs with changes, those matrix jobs might not be considered 'completed', so if we just used the `needs` field,
the `devserver` job would not execute if there were no bundle or tab jobs.

This is why we have to configure the `if` field to use the complex expression it does: if there were bundle and tab jobs that executed, then
check that they all completed successfully before running the devserver job (if necessary). If there weren't, then run the devserver job if there were changes
made to the devserver.

## 4. `docserver`

The `docserver` job only executes if there were changes made to the modules library or the docs themselves. It doesn't deploy the docs here, so it the call to `yarn build` only serves as to way to check that the docs can be generated without errors like dead links.

Similar to the `devserver` job, the `docserver` job must also be configured to execute even if no bundle, tab or library jobs execute.

## 5. `repo-tasks`

This job consists of checking `yarn constraints` and running ESLint for the entire repository. It doesn't rely on any of the other jobs, so it runs in parallel to all of them.

## 6. `test`

The final `test` job is a summary step: it only executes if every other job that was supposed to execute did so successfully. The successful completion of this
job represents a successful execution of the entire workflow.
