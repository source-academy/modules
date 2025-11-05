# Other Workflows

There are other workflows that the repository uses, not just with Github Actions.

## `pre-push` Git Hook

This hook is run every time you try to push to a branch on the remote. The pre-push git hook is configured as follows:

The first thing it does is validate that the repository's constraints have been fulfilled using `yarn constraints`.

Then it runs the `tsc`, linting and testing for the bundles and tabs that have been modified (with reference to `master`). This feature is provided by Yarn using the `--since` filter.

Finally, it runs `tsc`, lints and tests the libraries and devserver, but also only if they have been modified with reference to `master`.

These Git Hooks are powered by [`husky`](https://github.com/typicode/husky).

## Deployment to Github Pages

Upon any successful merge into `master`, this action runs to deploy the modules site onto Github pages to automatically serve the default modules and their documentation.
