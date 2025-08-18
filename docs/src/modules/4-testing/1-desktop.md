# Running from the Desktop

It is possible to run `js-slang` directly from the desktop using the `js-slang` command line. However, this is only really useful for bundles, as `js-slang` from
the command line cannot display tabs.

You will need to change which module backend is in use using the `--modulesBackend` parameter.

If your package already depends on `js-slang`, then you can already run `js-slang` from the command line using `yarn js-slang`.

If not, you can either:
- Add `js-slang` to your dev dependencies
- Install the root repository package.
- Use the [`yarn dlx` command](https://yarnpkg.com/cli/dlx)

## The Modules Server

All modules related files are served from a single HTTP server. For `js-slang` to be able to access your local modules copies, you will have to run a local version
of this server and then point `js-slang` to it.

The `yarn buildtools serve` command will start a HTTP server and serve the `build` directory, which is where your bundle/tab should've been output to after compilation.

If need be, you can use the `--port` option or the `PORT` environment variable to change what port the server listens on, the default being 8022.

Similarly, `--bind` can be used to change which interface the server listens on.

> [!WARNING] On Focused Installs
> The HTTP server is provided by the buildtools and thus is only available within packages that have installed the buildtools. If you used
> a focused Yarn install, then the `serve` command is only available within your bundle's/tab's package.
>
> Using a focused install also means that other bundles and tabs are not available for use during your testing, as they will not be compiled.
>
> If the `serve` command is unavailable for whatever reason, you can install it with the root repository using
> `yarn workspaces focus @sourceacademy/modules` and then run `yarn serve` from the root repository.
