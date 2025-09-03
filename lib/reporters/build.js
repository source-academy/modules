/**
 * Script for building vitest reporter
 */

// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const command = getBuildCommand({
  entryPoints: ['./index.cts'],
  bundle: true,
  format: 'cjs',
  outfile: './dist.cjs',
  platform: 'node',
  target: 'node20',
  tsconfig: './tsconfig.json',
  packages: 'external'
  // external: ['@actions/core'],
});

await command.parseAsync();
