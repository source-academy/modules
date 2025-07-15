/**
 * Script for building markdown-tree plugin
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
      format: 'cjs',
      minify: !dev,
      // Something just doesn't work right (something requires the 'node:process' module which can't be found)
      // when its compiled to ESM, so unfortunately we need to compile this to CJS instead.
      outfile: './dist.cjs',

      // Node builtin modules are present at runtime but our lodash dependency is not
      // That's why we don't externalize lodash when bundling with esbuild
      platform: 'node',
      target: 'node20',
      tsconfig: './tsconfig.json'
    });
  });

await command.parseAsync();
