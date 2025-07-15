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
```dirtree
path: ../../../lib/buildtools/
children:
  - name: bin
    children:
      - name: templates
        comment: Actual template files, retrieved at runtime
      - name: docsreadme.md
        comment: Docs HTML readme, retrieved at runtime
      - name: index.js
        comment: The compiled and bundled buildtools
  - name: src
    children:
      - name: __tests_mocks__
        comment: Contains a set of mock bundles and tabs for testing
      - name: build
        children:
          - name: docs
            comment: Builders for HTML and JSON documentation
          - name: modules
            comment: Builders for bundles and tabs
            children:
              - name: manifest.schema.json
                comment: Schema used to validate bundle manifests
              - name: all.ts
                comment: Combined builder for a specific bundle or tab
              - name: manifest.ts
                comment: Code for working with bundle manifests and bundle/tab resolution
      - name: commands
        comment: Code where command handlers are defined
      - name: prebuild
        comment: Code for running ESLint and tsc, both separately and in parallel
      - name: templates
        comment: Code for template commands
      - name: testing.ts
        comment: Code for running Vitest from NodeJS
  - name: workspacer.py
    comment: Python code for updating JSON files across bundles and tabs
```
