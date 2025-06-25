# Github Workflows

This repository relies on three different workflows:

1. On pull requests to the main branch
2. On pushing to any branch
3. Deployment to Github pages

## Pull Request Workflow

The full definition of the workflow is below:

<<< ../../../.github/workflows/pull-request.yml

The first job, `paths-filter`, determines what files are being changed during the pull request. This then allows us to determine if we need to run
the entire workflow, or only some jobs. For example, if no devserver code was modified, the `tsc`, tests and linting of the devserver is skipped.

However, since the devserver does rely on the compiled tabs, it becomes necessary to build the bundles and tabs before performing devserver actions.

## `pre-push` Git Hook
This hook is run every time you try to push to a branch on the remote. The pre-push git hook is configured as follows:

<<< ../../../.husky/pre-push {sh}

The first thing it does is validate that the repository's constraints have been fulfilled using `yarn constraints`.


Then it runs the `tsc`, linting and testing for the bundles and tabs that have been modified (with reference to `master`). This feature is provided by Yarn using the `--since` filter.

Finally, it runs `tsc`, lints and tests the libraries and devserver, but also only if they have been modified with reference to `master`.

## Deployment to Github Pages

Upon any successful merge into `master`, this action runs to deploy the modules site onto Github pages to automatically serve the default modules and their documentation.

Its configuration is shown below:

<<< ../../../.github/workflows/pages-deploy.yml
