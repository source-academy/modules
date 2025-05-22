/**
 * Script for building buildtools
 */

// @ts-check
import { Command } from '@commander-js/extra-typings';
import { build } from 'esbuild';

const command = new Command()
  .option('--dev', 'If specified, the built output is not minified for easier debugging')
  .action(async ({ dev }) => {
    await build({
      entryPoints: ['./src/commands/index.ts'],
      bundle: true,
      define: {
        __dirname: 'import.meta.dirname',
      },
      format: 'esm',
      minify: !dev,
      outfile: './bin/index.js',
      packages: 'external',
      platform: 'node',
      target: 'node20',
      tsconfig: './tsconfig.json'
    });
  });

await command.parseAsync();
