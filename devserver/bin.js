#!/usr/bin/node
// @ts-check

import { Command } from '@commander-js/extra-typings';
import { createServer } from 'vite';

await new Command()
  .option('--port <port>', 'Port to bind to', value => parseInt(value), 5173)
  .option('--host <host>', 'Host address to bind to', '127.0.0.1')
  .action(async opts => {
    const server = await createServer({
      root: import.meta.dirname,
      server: {
        host: opts.host,
        port: opts.port
      }
    });

    await server.listen();
    server.printUrls();
    server.bindCLIShortcuts();
  })
  .parseAsync();
