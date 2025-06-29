---
title: Build Tools
---

# Build Tools Overview

The Source Academy Modules build tools are written in Typescript and designed to be run from the command line

The build tools are comprised of several sections:

- [Command Handlers](./2-command)
  - The actual code that runs command line argument parsing
- [Builders](./5-builders/)
  - The code that converts a bundle or tab into its outputs
- [Prebuild Tasks](./6-prebuild)
  - Code that is intended to be run before builders
- [Testing](./8-testing)
  - Code for integrating `vitest`
- [Templates](./7-templates)
  - Code for the template command

## Structure of the Build Tools package
```txt
uildtools
├── bin
│   ├── templates                     // Actual template files, retrieved at runtime
│   ├── docsreadme.md                 // Docs HTML readme, retrieved at runtime
│   └── index.js                      // The compiled buildtools
├── src
│   ├── ___test_mocks__               // Contains a set of mock bundles and tabs for testing
│   ├── build
│   │   ├── docs                      // Docs Builders
│   │   ├── modules
│   │   │   ├── bundle                // Bundle Builder
│   │   │   ├── tab                   // Tab Builder
│   │   │   └── manifest.schema.json  // Schema used to validate bundle manifests
│   │   └── manifest                  // Code related to manipulating manifests
│   ├── commands                      // Code where command handlers are defined
│   ├── prebuild                      // Code for running ESLint and tsc
│   ├── templates                     // Code for the template commands
│   └── testing.ts                    // Code for running Vitest from Node
└── workspacer.py                     // Python code for updating JSON files across bundles and tabs
```
