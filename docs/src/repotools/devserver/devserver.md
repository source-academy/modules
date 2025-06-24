# Modules Development Server

This server relies on [`Vite`](https://vitejs.dev) to create a server that automatically reloads when it detects file system changes. This allows Source Academy developers to make changes to their tabs without having to use the frontend, and have it render code changes live.

The components here were copied from the frontend's playground and then simplified.

## Compiled Tabs vs Hot Reload
Normally, the Source Academy frontend uses the bundled version of the tabs. However, the development server relies on the raw Typescript files by default so as to enable hot reloading. If you wish to test the compiled versions, use the settings button to toggle using compiled tabs.

## `mockModuleContext.ts`
For compiled tabs, `js-slang/context` is not an import that should be required. However, in hot-reload mode, because some tabs rely on their corresponding bundles, `js-slang/context` is an import that needs to be provided.

The `vite` config aliases `js-slang/context` to the `mockModuleContext.ts` file, which can then be used to simulate the evaluation context.

## Vitest Testing
The `vitest` framework integrates with `playwright` and allows us to actually simulate user actions on the browser page. This is used to test the functionality of the development server.

