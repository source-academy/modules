---
title: Working With Git
---
# Git/Github Workflows

When making changes to the code in this repository, you should abide by some good Git conventions:

<!-- Add More-->
- Commit often with informative commit messages
- Run the `pre-push` Git Hook before pushing so that your code is verified locally

> [!TIP] Lockfiles
> Package managers such as `yarn` and `npm` use a single file called the lockfile to keep track of the dependencies and their dependencies and so on.
> Since this repository uses Yarn, the lockfile we use is `yarn.lock`.
>
> There is always only one lockfile. Even if you use focused installs or add a dependency to a single package, `yarn.lock` will be modified.
>
> When you add a dependency to your bundle/tab, remember to run your installation command to ensure that the lockfile gets updated, and then
> commit the changes to the lockfile.

> [!WARNING] package-lock.json
> If you accidentally run installation commands with `npm` instead (i.e `npm i`), a different type of lockfile will get generated. This file should be
> deleted if present and should not be added to the repository.

## Creating your own branch

The `master` branch of the repository is protected. This means that you cannot push commits directly to it, nor can pull requests be merged
into the branch without first passing code review.

You shouldn't be using it as a remote for the development work you do on your own machine. Instead, use `git branch` (or whatever other mechanism)
to create a separate branch off of `master` for your own use.

> [!TIP] Forking
> You can _fork_ the repository, but strictly speaking this is not necessary.

Make sure that the branch is named appropriately. For example, if you were creating a new bundle called `matrix`, then your branch could be named
`matrix_bundle`.

## Procedure for Pull Requests

When you're ready for your work to be incorporated into the `master` branch, [open](https://github.com/source-academy/modules/compare) a pull request with the modules repository to merge your
changes into `master` branch. Make sure that your branch is up-to-date with the `master` branch (by performing a `git merge` from the `master` branch to your own branch).

When you open a PR in Github, Github will automatically scaffold the PR for you with some helpful headers and checklists. Do provide an informative description
of what your PR intends to achieve as well as mark off the relevant checklist items. You can refer to other PRs (both open as well as ones that have been closed)
for further examples of what to write.

This will automatically trigger the repository's workflows, which will verify that your changes don't break any of the existing code. If the
workflow fails, check the summary and determine where the errors lie, then fix your code as necessary.

Once your code has been reviewed, the pull request will be merged.

## Opening Issues

If you have a bug report or feature request, open an issue with the appropriate label(s) [here](https://github.com/source-academy/modules/issues)

## `.gitignore` Files

You should include files that are produced from compilation into your own `.gitignore` file and avoid committing them to the repository. By default,
the `dist` folders are ignored for all bundles and tabs, but if you need to add other files you can create a custom `.gitignore` in your bundle/tab's
directory.

> [!TIP]
> If you want to remove a file that been committed in the past you can use `git rm` or\
> `git rm --cached`.
