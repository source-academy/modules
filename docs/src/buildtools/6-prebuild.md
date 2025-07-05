# Prebuild Tasks

There are two "prebuild" tasks, linting and type checking that need to be run before any kind of building takes place.

The buildtools call both ESLint and `tsc` in parallel since they are not dependent on each others' outputs.

## Running ESLint from the Command Line
ESLint provides [documentation](https://eslint.org/docs/latest/integrate/nodejs-api) detailing how to use its Node API. Below is the code that does just that:

<<< ../../../lib/buildtools/src/prebuild/lint.ts {ts:line-numbers}

Because the configuration file for the repository is located at the root of the repository, we need to set the `cwd` to the path to the root of the repository when
initializing the `ESLint` instance. This allows ESLint to resolve the configuration correctly.

Linting warnings and errors come in two types, fixable and non-fixable. Fixable errors don't cause a non-zero exit code when ESLint is run with `--fix`, while non-fixable
errors always cause a non-zero exit code.

ESLint provides several [formatters](https://eslint.org/docs/latest/use/formatters/) for processing the results objects it returns. To produce the human readable output that is printed to the command line, the `stylish` formatter
is loaded and used.

::: details Inspecting the Linting Config
The entire repository's linting configuration is located at the root of the repository within `eslint.config.js`. If you want to view the view what rules are being applied to which files you can
use the config inspector, which can be started using `yarn lint:inspect`
:::

## Calling Typescript from Node

Most of the code for running Typescript functionality from Node was taken from [this](https://github.com/Microsoft/TypeScript/issues/6387) Github issue.

<<< ../../../lib/buildtools/src/prebuild/tsc.ts {ts:line-numbers}

The high level overview of this process is as follows:
1. Read the raw text from the `tsconfig.json`
2. Parse the `tsconfig.json` into a JSON object using `ts.parseConfigFileTextToJson`
3. Parse the JSON object into actual compiler options using `ts.parseJsonConfigFileContent`. This also returns an array of file names for parsing.
4. Use `ts.createProgram` to get the preliminary program for type checking only.
5. Call `typecheckProgram.emit()` to produce the typechecking results.
6. Combine the results with `ts.getPreEmitDiagonstics`.
7. If there were no typechecking errors and the `tsconfig.json` did not specify <nobr><code>noEmit: true</code></nobr>, use `ts.createProgram` again with the typecheck program to perform compilation and declaration file emission excluding test files.
8. Format the diagnostic objects using `ts.formatDiagnosticsWithColorAndContext`

### Reading and Parsing `tsconfig.json`
The first three steps in the process involve reading the raw text from the `tsconfig.json` and then parsing it. At the end of it, `ts.parseJsonConfigFileContent` resolves all the inherited options and produces the compiler options
in use, as well as the file paths to the files that are to be processed.

### Type Checking
At step 4, `ts.createProgram` is called for the first time. It is called with every single file as returned from `ts.parseJsonConfigFileContent`. However, it is called with `noEmit: true`. This prevents any Javascript and Typescript declaration files from being written.
This is important because we want test files to be type checked, but we don't want them to be compiled into Javascript and exported with the rest of the code. If they were included and the `tsconfig` was configured to produce outputs, the test files would end
up being written to the `outDir`. `typecheckProgram.emit` is called to perform the type checking.

If there are no errors and the `tsconfig` was configured to produce outputs, `ts.createProgram` is called again. This time, test files are filtered out. `ts.createProgram` has a parameter for passing in the previous program object, allowing it to reuse
an existing program so it doesn't have to reinitialize the entire object again. `program.emit` is called to produce any compiled Javascript and Typescript declaration files.
