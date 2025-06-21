/**
 * Script for building lintplugin
 */

// @ts-check
import { Command } from '@commander-js/extra-typings';
import { build } from 'esbuild';

const command = new Command()
  .option('--dev', 'If specified, the built output is not minified for easier debugging')
  .action(async ({ dev }) => {
    await build({
      entryPoints: ['./src/index.ts'],
      bundle: true,
      format: 'esm',
      minify: !dev,
      outfile: './dist.js',
      packages: 'external',
      platform: 'node',
      target: 'node20',
      tsconfig: './tsconfig.prod.json'
    });
  });

await command.parseAsync();
