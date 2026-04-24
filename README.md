# Source Academy Modules Repository

![License](https://img.shields.io/badge/License-Apache%202.0-brightgreen) [![pages-build-deployment](https://github.com/source-academy/modules/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/source-academy/modules/actions/workflows/pages/pages-build-deployment)

This repository contains the default modules of the Source Academy and their documentation, alongside all the libraries and tooling required for development.

The [Source Academy](https://sourceacademy.org) and [Source Academy @ NUS](https://sourceacademy.nus.edu.sg) are configured to access the default module site when evaluating `import` directives.

If you are looking for the documentation for the default modules, that can be found [here](https://source-academy.github.io/modules/documentation).

If you are a developer looking to do things like create a new bundle or work with the repository, the developer documentation can be found [here](https://source-academy.github.io/modules/devdocs).

## Quick Links

| Site                          | Link                                                     |
|-------------------------------|----------------------------------------------------------|
| Source Academy                | <https://sourceacademy.org>                              |
| Default Modules Deployment    | <https://source-academy.github.io/modules>               |
| Default Modules Documentation | <https://source-academy.github.io/modules/documentation> |
| Developer Documentation       | <https://source-academy.github.io/modules/devdocs>       |
| `js-slang`                    | <https://github.com/source-academy/js-slang>             |
| Frontend                      | <https://github.com/source-academy/frontend>             |

## Repository Structure

```txt
.
├── .github
│   ├── actions        // Custom Github Actions
│   └── workflow       // CI/CD Workflow files
├── build              // Output for compiled assets
├── devserver          // Development Server
├── docs               // Documentation Server
├── lib                // Common libraries used throughout the repo
├── src
│   ├── archive        // Archived bundles and tabs
│   ├── bundles        // Source Bundles
│   ├── tabs           // Source Tabs
│   └── java           // java-slang
├── vitest.config.ts   // Root Vitest Config
├── eslint.config.js   // ESLint Config
└── yarn.config.cjs    // Yarn Constraints file
```

## Building the documentation server

1. Run the command: `yarn workspaces focus @sourceacademy/modules-docserver`
2. `cd` into the `docs` directory and run `yarn dev`.

You should now have a local copy of the modules' developer documentation running on your machine.

## Conductor migration

For migration to the conductor framework, we have a branch `conductor-migration` with a draft PR https://github.com/source-academy/modules/pull/680 associated with it (to keep the branch up-to-date with ongoing changes). The `conductor-migration` branch is autodeployed to github pages using the `modules-conductor` repo.
