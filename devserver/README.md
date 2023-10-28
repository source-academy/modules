# Source Academy Tab Development Server

This server relies on [`Vite`](https://vitejs.dev) to create a server that automatically reloads when it detects file system changes. This allows Source Academy developers to make changes to their tabs without having to use the frontend, and have it render code changes live.

The server is designed to be run using `yarn devserver` from the repository's root directory, hence `vite.config.ts` is not located within this folder.