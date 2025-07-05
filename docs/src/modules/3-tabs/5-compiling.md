# Compiling a Tab
This page contains information on compiling tabs for the Source Academy Frontend.

> [!WARNING]
> The build tools automatically ignore files under a `__tests__` directory. Such files are considered
> test files and will not be included in the compiled output.


Run the following command from within your bundle directory:
```sh
yarn build
```

Note that running this command will **NOT** perform typechecking. If you wish to perform typechecking, use the following command:
```sh
yarn build --tsc
```

This will run the TypeScript compiler before compiling your tab. If there are any type errors, it will be displayed in the command line.

The output for your tab will be placed at `/build/tabs/[your_tab_name].js`.

::: details Runtime Dependencies
Since dependencies like React and `@blueprintjs/core` are used by the frontend, the frontend provides these pacakges to tabs when they are loaded.
This means that these dependencies do not need to be bundled with the tab during compilation and are thus marked as external.

Externalizing dependencies reduces the bundle size of our tabs. You should keep the number of non-externalizable packages that your tab relies on to a minimum.
:::
