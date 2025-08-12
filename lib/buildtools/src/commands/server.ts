/*
 * Adapted directly from the http-server package
 */

import { Command } from '@commander-js/extra-typings';
import { outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import chalk from 'chalk';
import { createServer } from 'http-server';
import { logCommandErrorAndExit } from './commandUtils.js';

export default function getHttpServerCommand() {
  return new Command('serve')
    .option(
      '-p, --port <port>',
      'Port to serve modules over. If 0, look for open port.',
    )
    .option('--bind <address>', 'Address to bind to', '127.0.0.1')
    .action(({ port: portStr, bind: hostname }) => {
      portStr = portStr ?? process.env.PORT;
      let port = 8022;
      if (portStr) {
        const portVal = parseInt(portStr);
        if (Number.isNaN(portVal) || portVal < 0 || portVal > 65535) {
          logCommandErrorAndExit(`Invalid port ${portStr}`);
        }

        port = portVal;
      }

      const server = createServer({
        cache: -1,
        cors: true,
        root: outDir,
        logFn(req, res, err: any) {
          const date = new Date();
          const ip = req.headers['x-forwarded-for'] || '' + req.socket.remoteAddress;
          if (err) {
            console.info(
              '[%s] %s "%s %s" Error (%s): "%s"\n',
              date,
              ip,
              chalk.red(req.method),
              chalk.red(req.url),
              chalk.red(err.status.toString()),
              chalk.red(err.message)
            );
          } else {
            console.info(
              '[%s] %s "%s %s" "%s\n"',
              date,
              ip,
              chalk.cyan(req.method),
              chalk.cyan(req.url),
              req.headers['user-agent']
            );
          }
        },
      });

      const logMessage = [
        chalk.bold(chalk.greenBright('Modules Server')),
        '\n\n',
        chalk.bold('➜ Address:         '),
        chalk.cyanBright(`http://${hostname}:${port}`),
        '\n',
        chalk.bold('➜ Build Directory: '),
        chalk.cyanBright(outDir),
        '\n\n',
        chalk.yellowBright('Use Ctrl+C to stop')
      ];
      console.log(logMessage.join(''));
      server.listen(port, hostname);
    });
}
