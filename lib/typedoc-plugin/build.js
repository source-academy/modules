/**
 * Script for building typedoc plugin
 */

// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const command = getBuildCommand({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  external: ['typedoc'],
  format: 'esm',
  outfile: './dist/index.js',
  packages: 'bundle',
  platform: 'node',
  tsconfig: './tsconfig.json',
});

await command.parseAsync();
