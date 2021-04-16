# Source Modules

![License](https://img.shields.io/badge/License-Apache%202.0-brightgreen) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/source-academy/modules/github%20pages?label=Build)

This repository contains publicly availble Source Modules and their documentation. 

Try out Source Academy [here](https://source-academy.github.io/). 

See the Source Modules [wiki](https://github.com/source-academy/modules/wiki) for more details.

Check out the Source Modules generated API documentation [here](https://source-academy.github.io/modules/documentation).

## Aims

1. Decouple _Source_ modules from the frontend and backend of Source Academy, as well as the implementation of _Source_ language, enhancing the flexibility of _Source_ modules.
2. Optionally render interactive user interfaces for students to use with Source Academy to enhance their learning experience.
3. Allow ease of collaboration and promotes contribution to the modules ecosystem without a steep learning curve. 

## Terminologies

| **Term**   | **Description**                                                    |
| ---------- | ------------------------------------------------------------------ |
| **Module** | A set of **one** bundle _with the same name_ and **some/no** tabs. |
| **Bundle** | The suite of functions that are provided by the module.            |
| **Tab**    | A user interface used by the module.                               |

## Getting Started

### Set Up

The following set of instructions explain how to clone and set up a copy of the Source Modules code repository on your local development machine. Following the steps below will create a  `modules` directory in your local development machine and install the necessary dependencies of the project. 

You will need to have a stable version of [NodeJS](https://nodejs.org/en/) on your local development machine. We recommend using the latest LTS version. You can use [nvm](https://github.com/creationix/nvm#installation) _(macOS/Linux)_ or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects. 

You will also need to have a package manager for your project. We recommend using a stable version of [Yarn](https://yarnpkg.com/) as the repository pipelines are using the Yarn package manager as well. To install the Yarn package manager through [NPM](https://www.npmjs.com/), you can run the following command.
```
npm install -g yarn
```

Clone the repository on your local development machine and navigate to it using your favourite command line or shell tool.
```
git clone https://github.com/source-academy/modules.git
cd modules
```

Install all the dependencies of the project into `node_modules` in the root folder of your project directory. 
```
yarn install
```

### Serve Source Modules

The following set of instructions explain how to transpile and serve the Source Modules from your local development machine's code repository. Following the steps below will transpile all the modules in your project directory into JavaScript files located in the `build` folder. Thereafter, you will serve all the contents of the build folder in a server on your local development machine. 

To transpile the Source modules' files from `src` into JavaScript files in `build`, run the following command.
```
yarn run build
```

To start the server that serves all the contents of the `build` folder in the root directory of the project, run the following command. By default, running this command serves the contents of the `build` folder on http://localhost:8022.
```
yarn run serve
```

### Development with Frontend `cadet-frontend`

The following set of instructions explain how to use a local copy of the Source Academy [frontend](https://github.com/source-academy/cadet-frontend) with a local copy of the Source Modules code repository. Following the steps below will configure the environment of the Source Academy frontend to use your locally served `Source` modules instead of the publicly available ones. Doing this will allow you to develop and modify modules without affecting the currently publicly available ones. 

You will need to already have a local instance of Source Academy frontend set up. If you do not, you can follow the instructions [here](https://github.com/source-academy/cadet-frontend#getting-started) to setup an instance of Source Academy frontend on your local development machine. 

Ensure that the environment variable `REACT_APP_MODULE_BACKEND_URL` in the `.env` file of the Source Academy frontend is configured to the URL of the Source Modules' server that you are trying to retrieve _Source_ modules from. At the same time, make sure that the server providing the `Source` modules is running. By default, the local server started by running `yarn run serve` is on http://localhost:8022. The publicly available _Source_ modules is currently located at https://github.com/source-academy/modules. 

Upon starting the local instance of Source Academy frontend, the Source Academy playground will be connected to the Source Modules code repository. 

### Development with Source Implementation `js-slang`

The following set of instructions explain how to use a local copy of the Source language [implementation](https://github.com/source-academy/js-slang) with a local copy of the Source Modules code repository and Source Academy frontend. Following the steps below will allow you to work on your local `js-slang` code repository and use it with the Source Modules project and Source Academy frontend. 

You will need to already have a local instance of the Source implementations set up. If you do not, you can follow the instructions [here](https://github.com/source-academy/js-slang#usage) to setup an instance of the Source implementations on your local development machine. 

Follow the instructions highlighted [here](https://github.com/source-academy/js-slang#usage) to build and link your local instance of Source implementations with your local instance of the Source Academy frontend. 

Follow the instructions to setup the Source Modules code repository with Source Academy frontend highlighted in the above section as per normal to use your local `js-slang` with your local `cadet-frontend` and Source Modules code repository. 

## License

[![Apache 2][apache2-image]][apache2]

All JavaScript programs in this repository are licensed under the
[Apache License 2.0][apache2].

[apache2]: https://www.apache.org/licenses/LICENSE-2.0
[apache2-image]: https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apache_Software_Foundation_Logo_%282016%29.svg/200px-Apache_Software_Foundation_Logo_%282016%29.svg.png
