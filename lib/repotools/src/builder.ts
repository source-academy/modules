import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { build, context, type BuildOptions, type Plugin } from 'esbuild';

/**
 * An ESBuild plugin that triggers when a build finishes to print out a success
 * message
 */
export const endBuildPlugin = {
  name: 'on-build-end',
  setup({ onEnd }) {
    onEnd(({ outputFiles }) => {
      if (outputFiles?.length === 1) {
        const [{ path }] = outputFiles;
        const now = new Date();
        const times = [
          now.getHours(),
          now.getMinutes(),
          now.getSeconds()
        ];

        const timeStr = times.map(each => each.toString().padStart(2, '0')).join(':');
        console.log(`[${timeStr}]: ${chalk.greenBright(`Output written to ${path}`)}`);
      }
    });
  }
} satisfies Plugin;

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
          plugins: [endBuildPlugin]
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
