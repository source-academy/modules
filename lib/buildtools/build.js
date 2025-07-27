/**
 * Script for building buildtools
 */

// @ts-check
import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { build, context } from 'esbuild';

const command = new Command()
  .option('--dev', 'If specified, the built output is not minified for easier debugging')
  .option('--watch', 'Run esbuild in watch mode')
  .action(async ({ dev, watch }) => {
    /**
     * @type {import('esbuild').BuildOptions}
     */
    const esbuildOptions = {
      entryPoints: ['./src/commands/index.ts'],
      banner: {
        js: '#!/usr/bin/node'
      },
      bundle: true,
      format: 'esm',
      minify: !dev,
      outfile: './bin/index.js',
      packages: 'external',
      platform: 'node',
      target: 'node20',
      tsconfig: './tsconfig.json',
    };
    if (watch) {
      const buildContext = await context({
        ...esbuildOptions,
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
      await build(esbuildOptions);
    }
  });

await command.parseAsync();
