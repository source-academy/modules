# Modules

![License](https://img.shields.io/badge/License-Apache%202.0-brightgreen) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/source-academy/modules/github%20pages?label=Build)

This repository contains the default modules of the Source Academy and their documentation, deployed to the default module site at <https://source-academy.github.io/modules>.

The [Source Academy](https://sourceacademy.org) and [Source Academy @ NUS](https://sourceacademy.nus.edu.sg) are configured to access the default module site when evaluating `import` directives.

[Documentation of Source Academy modules](https://source-academy.github.io/modules/documentation).

## Information for Module Developers

See the modules [wiki](https://github.com/source-academy/modules/wiki) for more details.

### Terminology

| **Term**   | **Description**                                                    |
| ---------- | ------------------------------------------------------------------ |
| **Module** | A set of **one** bundle _with the same name_ and **some/no** tabs. |
| **Bundle** | The suite of functions that are provided by the module.            |
| **Tab**    | A user interface used by the module.                               |

### Getting Started

The following set of instructions explain how to clone and set up a copy of the `modules` code repository on your local development machine. Following the steps below will create a  `modules` directory in your local development machine and install the necessary dependencies of the project.

The recommended version of [Node.js](https://nodejs.org/en/) for local development is Node.js 20. You may use a Node.js version manager such as [nvm](https://github.com/creationix/nvm#installation) _(macOS/Linux)_ or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node.js versions between different projects.

This project also uses [Yarn](https://yarnpkg.com/) as a package manager. You may install and enable Yarn by running the following command.
```bash
corepack enable
```

If the above does not work, you can manually install the Yarn package manager through [NPM](https://www.npmjs.com/) using the following command.

```bash
npm install -g yarn
```

You may also require [Python](https://www.python.org/downloads/) to run build scripts and install project dependencies. We recommend either using Python 2.7 or Python 3.8-3.11.

Clone the repository on your local development machine and navigate to it using your favourite command line or shell tool.

```bash
git clone https://github.com/source-academy/modules.git
cd modules
```

Install all the dependencies of the project into `node_modules` in the root folder of your project directory.

```bash
yarn install
```

If you encounter errors with esbuild dependencies like the following while building:

```plaintext
Error: The package "@esbuild/darwin-arm64" could not be found, and is needed by esbuild.
```

You will need to delete the `node_modules` folder and rerun `yarn install` to fix the issue.

### Serve Modules

The following set of instructions explain how to transpile and serve the modules from your local development machine's code repository. Following the steps below will transpile all the modules in your project directory into JavaScript files located in the `build` folder. Thereafter, you will serve all the contents of the build folder in a server on your local development machine.

To transpile the modules' files from `src` into JavaScript files in `build`, run the following command.

```bash
yarn run build:all
```

To start the server that serves all the contents of the `build` folder in the root directory of the project, run the following command. By default, running this command serves the contents of the `build` folder on <http://localhost:8022>.

```bash
yarn run serve
```

### Development with Source Academy `frontend`

The following set of instructions explains how to use a local copy of the Source Academy [frontend](https://github.com/source-academy/frontend) with a local copy of the modules code repository. Following the steps below will configure the environment of the Source Academy frontend to use your locally served modules instead of the publicly available ones. Doing this will allow you to develop and modify modules without affecting the currently publicly available ones.

You will need to already have a local instance of Source Academy frontend set up. If you do not, you can follow the instructions [here](https://github.com/source-academy/frontend#getting-started) to setup an instance of Source Academy frontend on your local development machine.

Ensure that the environment variable `REACT_APP_MODULE_BACKEND_URL` in the `.env` file of the Source Academy frontend is configured to the URL of the module site that you are trying to retrieve modules from. At the same time, make sure that the server hosting the modules site is running. By default, the local server started by running `yarn run serve` is on <http://localhost:8022>. The default modules are implemented in the repository <https://github.com/source-academy/modules> and deployed to the modules site <https://source-academy.github.io/modules>.

Upon starting the local instance of Source Academy frontend, the Source Academy will connect to the configured modules site.

### Development Guide

Please refer to the Modules Development Guide located in the modules wiki [here](https://github.com/source-academy/modules/wiki/Development-Guide) for more information regarding how to create your own module including its own bundle and tab.

## License

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

All sources in this repository are licensed under the [Apache License Version 2][apache2].

[apache2]: https://www.apache.org/licenses/LICENSE-2.0.txt
