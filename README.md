# Modules

This repository will contain publicly available modules and their documentation, starting in 2020.

See wiki for details: https://github.com/source-academy/modules/wiki

## Getting Started

### Clone, Install Dependencies and Compile modules

1. Install a stable version of [NodeJS](https://nodejs.org/en/). The active LTS or current version should work fine.
2. Install a stable version of [Yarn](https://yarnpkg.com/).
```
$ npm install -g yarn
```
3. Clone this repository and navigate to it in your command line or shell tool.
```
$ git clone https://github.com/source-academy/modules.git
$ cd modules
```
4. Run `yarn install` to install dependencies.

### Serving the Modules' JavaScript Files

1. Run `yarn run build` to transpile the modules' files from `src` folder into `build` folder.
2. Run `yarn serve` to start the http-server on http://localhost:8022 to serve the `.js` files in `build` folder.

### Using with Cadet Frontend

1. Follow the [setup](https://github.com/source-academy/cadet-frontend#getting-started) instructions on Cadet Frontend.
2. When [setting up](https://github.com/source-academy/cadet-frontend#getting-started) the backend configuration of Cadet Frontend, ensure that `REACT_APP_MODULE_BACKEND_URL=http://localhost:8022` from the subsection above. 
3. Ensure that you are serving the modules' javascript files in a local server. Refer to the subsection above for instructions. 
4. [Start up](https://github.com/source-academy/cadet-frontend#getting-started) the Cadet Frontend local development server to use the served modules. 

## License

[![Apache 2][apache2-image]][apache2]

All JavaScript programs in this repository are licensed under the
[Apache License 2.0][apache2].

[apache2]: https://www.apache.org/licenses/LICENSE-2.0
[apache2-image]: https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Apache_Software_Foundation_Logo_%282016%29.svg/200px-Apache_Software_Foundation_Logo_%282016%29.svg.png
