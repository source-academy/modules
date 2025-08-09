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

Things to check for:
- Remove any errant `package.json` or `.yarnrc.yml` files in places like your home directory or elsewhere.
- Run `npm uninstall -g yarn` if you previously instally Yarn using installed `npm`.
