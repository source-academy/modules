import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { build, context, type BuildOptions } from 'esbuild';

/**
 * Returns a {@link Command} that executes with the provided ESBuild options.
 */
export default function getBuildCommand(esbuildOptions: Omit<BuildOptions, 'minify'>) {
  return new Command()
    .option('--dev', 'If specified, the built output is not minified for easier debugging')
    .option('--watch', 'Run esbuild in watch mode')
    .action(async ({ dev, watch }) => {
      if (watch) {
        const buildContext = await context({
          ...esbuildOptions,
          minify: !dev,
          plugins: [{
            name: 'Watch Plugin',
            setup({ onEnd }) {
              onEnd(() => {
                console.log(chalk.greenBright('Build completed.'));
              });
            }
          }]
        });
        console.log(chalk.yellowBright('Running ESBuild in watch mode.'));
        await buildContext.watch();
      } else {
        await build({
          ...esbuildOptions,
          minify: !dev,
        });
      }
    });
}
