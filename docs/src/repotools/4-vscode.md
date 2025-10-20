# VSCode Integration

This page is dedicated to explaining all the VSCode integrations available from this repository.

Since most developers here are assumed to be using Visual Studio Code, this repository automatically provides some extra tooling that integrates with VSCode, all found within the `.vscode` folder.

## JSON Schemas

By default, VSCode doesn't apply any kind of validation to JSON files that don't have explicit schemas. Using the `settings.json` file, we can apply JSON schemas to specific JSON files.

For this repository, this has been configured for `tsconfig.*.json` files to extend both the original `tsconfig` schema, but also to include the Typedoc schema. Bundle manifest files
should also automatically receive validation and IntelliSense autocompletion.

## ESLint Validation

By default, the VSCode ESLint extension doesn't also lint YAML files. This means that although ESLint will lint YAML files, the linting warnings and errors
for YAML files will not appear in VSCode. Thus, we need to provide a specific configuration to tell the extension to lint YAML files.
