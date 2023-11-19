# Source Academy Modules Build System
This folder contains all the code used to build Source modules. By default, the `build` command will build all assets, but a specific subcommand can be used to build only certain assets.

You can refer to the specific documentation for each type of asset:\
- [Building documentation](docs/README.md)
- [Building modules](modules/README.md)

Command line parsing functionality is provided by the [`commander`](https://github.com/tj/commander.js) package. An instance of `Command` is designed to be used only once per set of arguments parsed, so to facilitate testing several of the `Command` instances have been written as functions (e.g. `getBuildCommand`) that return a new instance when called.