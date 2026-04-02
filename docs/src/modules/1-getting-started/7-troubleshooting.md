# Troubleshooting

## Installation Troubleshooting

### ESBuild Error

If you encounter errors with esbuild dependencies like the following while building:

```txt
Error: The package "@esbuild/darwin-arm64" could not be found, and is needed by esbuild.
```

You will need to delete the `node_modules` folder and rerun your installation command.

### Yarn/Corepack Installation Issues

Especially if you've worked with other Javascript/Typescript projects before, you might find that `corepack enable` is a command that
does not seem to work (or work permanently) for you.

For example, you might find that `corepack enable` has no effect and the version of Yarn being used is an incorrect version when you run commands.

Things to check for:

- Remove any errant `package.json` or `.yarnrc.yml` files in places like your home directory or elsewhere.
- Run `npm uninstall -g yarn` if you previously installed Yarn globally using installed `npm`.
- For people running Windows, `corepack enable` is a command that needs to be run using administrator privileges.
If this is not possible for you, there are [workarounds](https://github.com/nodejs/corepack?tab=readme-ov-file#corepack-enable--name).
