# Setting up the development environment
To begin developing using this repository, follow the following steps to setup your local development environment.

## 1. Download and Install NodeJS
A stable version of [NodeJS](https://nodejs.org/en/) is required on your local development machine. Select a version of NodeJS that is compatible with the version that the repository uses (found in the `.node-version` file). Typically, the LTS release will suffice.

You can use [nvm](https://github.com/creationix/nvm#installation) _(macOS/Linux)_ or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) _(windows)_ to switch Node versions between different projects.

## 2. Clone this Repository
Clone the modules repository to your local machine using `git` or your tool of choice.

## 3. Install Yarn
The modules repository pipelines rely on the [Yarn](https://yarnpkg.com/) package manager. To install the Yarn package manager through [NPM](https://www.npmjs.com/), you can run the following command in the development directory: `npm install yarn`

> [!TIP]
> If you already have Yarn installed, you might find that you have a different version installed than the one used by the repository. Use the `yarn set version` command to install the correct version.

> [!TIP]
> If you are on MacOS, you may find that the version of Yarn used by your terminal is not correct, even after running `yarn set version`. You may have to run the command every time you start a new terminal instance.

At this point it is not necessary to run `yarn install` yet to install dependencies. Depending on what you are doing, there are different methods for installing dependencies.

## Next Steps
Once your environment has been setup, refer to the following guides:
* [Creating a new bundle](./bundle/creating)
* [Creating a new tab](./tabs/creating)
* [Modifying an existing bundle](./bundle/editing.md)
* [Modifying an existing tab](./tabs/editing.md)

## Development with local versions of `js-slang`

If you require a custom version of `js-slang` follow the instructions [here](https://github.com/source-academy/js-slang#using-your-js-slang-in-your-local-source-academy).
