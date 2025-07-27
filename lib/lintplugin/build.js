/**
 * Script for building lintplugin
 */

// @ts-check
import getBuildCommand from '@sourceacademy/lib-compiler';

const command = getBuildCommand({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: './dist.js',
  packages: 'external',
  platform: 'node',
  target: 'node20',
  tsconfig: './tsconfig.prod.json'
});

await command.parseAsync();
