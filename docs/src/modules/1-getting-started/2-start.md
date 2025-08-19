# Setting up the development environment

To begin developing using this repository, follow the following steps to setup your local development environment.

## 1. Download and Install NodeJS

A stable version of [NodeJS](https://nodejs.org/en/) is required on your local development machine. Select a version of NodeJS that is compatible with the version below. Typically, the LTS release will suffice.

<<< ../../../../.node-version

You can use [nvm](https://github.com/creationix/nvm#installation) _(macOS/Linux)_ or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) _(windows)_ to switch Node versions between different projects.

> [!INFO]
> The tooling in the repository is intended to work with both Posix-Compliant systems (macOS/Linux/WSL) _and_ Windows.
> If you encounter any compatibility issues do open an issue with the respository.

## 2. Clone this Repository

Clone the modules repository to your local machine using `git` or your tool of choice.

## 3. Install Yarn

The modules repository pipelines rely on the [Yarn](https://yarnpkg.com/) package manager. To install the Yarn package manager through [NPM](https://www.npmjs.com/), you can run the following command in the development directory: `corepack enable`.
This may prompt you to download the version of Yarn that this repository uses.

> [!INFO] Corepack and Yarn
> `corepack` is a tool that comes with NodeJS to help better manage the installation of package managers. Corepack allows the package manager to be defined at a package level, so
> multiple packages on the same systems can use different versions of the same package manager, or even different package managers altogether.
>
> `corepack enable` should automatically install the version of Yarn used by the repository, but if you face issues using `corepack`, you can still use `npm` to install Yarn. You will however, need to run
> `yarn set version` to change to the correct version of Yarn before working with the repository.
>
> If that is the case, you must take care **not** to commit the `yarnPath` changes that will be made to the `.yarnrc.yml` file.

## 4. Install the root package's dependencies

Run the following command to install the root package.
```sh
yarn workspaces focus @sourceacademy/modules
```

This will enable you to use some of the global scripts like templates.

At this point it is not necessary to run `yarn install` yet to install any other dependencies. Depending on what you are doing, there are different methods for installing dependencies.

## Next Steps

Once your environment has been setup, refer to the following guides:

* [Creating a new bundle](/modules/2-bundle/2-creating/2-creating)
* [Creating a new tab](/modules/3-tabs/2-creating)
* [Modifying an existing bundle](/modules/2-bundle/3-editing)
* [Modifying an existing tab](/modules/3-tabs/3-editing.md)

Make sure to read the other guides such as [this](./3-git) one for working with Git as well, especially if you're unfamiliar.

## Development with local versions of `js-slang`

If you require a custom version of `js-slang` follow the instructions [here](https://github.com/source-academy/js-slang#using-your-js-slang-in-your-local-source-academy).
