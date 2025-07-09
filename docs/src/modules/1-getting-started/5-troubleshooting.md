# Troubleshooting

## Installation Troubleshooting

### ESBuild Error
If you encounter errors with esbuild dependencies like the following while building:

```txt
Error: The package "@esbuild/darwin-arm64" could not be found, and is needed by esbuild.
```

You will need to delete the `node_modules` folder and rerun your installation command.
