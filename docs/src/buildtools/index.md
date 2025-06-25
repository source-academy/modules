---
title: Build Tools
---

# Build Tools Overview

The Source Academy Modules build tools are written in Typescript and designed to be run from the command line

The build tools are comprised of several sections:

- [Command Handlers](./1-command)
  - The actual code that runs command line argument parsing
- [Builders](./3-builders/)
  - The code that converts a bundle or tab into its outputs
- [Prebuild Tasks](./4-prebuild)
  - Code that is intended to be run before builders
- [Testing](./5-testing)
  - Code for integrating `vitest`
- [Templates](./6-templates)
  - Code for the template command

Explanations on how the build tools repository has been structured can be found [here](./2-structure)
