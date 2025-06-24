# Source Academy Modules Repository

![License](https://img.shields.io/badge/License-Apache%202.0-brightgreen) [![pages-build-deployment](https://github.com/source-academy/modules/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/source-academy/modules/actions/workflows/pages/pages-build-deployment)

This repository contains the default modules of the Source Academy and their documentation, alongside all the libraries and tooling required for development.

The [Source Academy](https://sourceacademy.org) and [Source Academy @ NUS](https://sourceacademy.nus.edu.sg) are configured to access the default module site when evaluating `import` directives.

## Quick Links
| Site | Link |
| ---- | ---- |
| Source Academy | https://sourceacademy.org |
| Default Modules Deployment | https://source-academy.github.io/modules |
| Default Modules Documentation | https://source-academy.github.io/modules/documentation |
| Developer Wiki | https://github.com/source-academy/modules/wiki |
| `js-slang` | https://github.com/source-academy/js-slang |
| Frontend | https://github.com/source-academy/frontend |

If you are looking for the documentation for the default modules, they can be found [here](https://source-academy.github.io/modules/documentation).

If you are a developer working with this repository, the developer documentation can be found [here](https://github.com/source-academy/modules/wiki)

## Repository Structure
The repository is designed as a monorepo, managed using Yarn workspaces.

```txt
.
├── .github            // Configuration for issue templates and workflows
├── .husky             // Configuration for code that runs on Git Hooks
├── .vscode            // Configuration for VSCode integration
├── build              // Output directory for compiled assets
├── devserver          // Modules Development Server
├── docs               // Developer Documentation and Server
├── lib                
│   ├── buildtools     // Scripts for compiling bundles and tabs
│   ├── lintplugin     // ESLint Plugin for SA Modules
│   └── modules-lib    // Common utilities and React components for SA Modules
├── src
│   ├── bundles        // Source code for Bundles
│   ├── tabs           // Source code for Tabs
│   └── java           // Assets for Source Java
├── eslint.config.js   // ESLint configuration for the entire repository
├── vitest.config.js   // Vitest configuration for the entire repository
└── yarn.config.cjs    // Yarn constraints configuration
```
