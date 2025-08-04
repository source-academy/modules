/**
 * Script for building lintplugin
 */

// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const command = getBuildCommand({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format: 'esm',
  outfile: './dist.js',
  packages: 'external',
  platform: 'node',
  target: 'node20',
  tsconfig: './tsconfig.json'
});

await command.parseAsync();
