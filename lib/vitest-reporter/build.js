/**
 * Script for building vitest reporter
 */

// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const command = getBuildCommand({
  entryPoints: ['./index.cts'],
  bundle: true,
  external: ['istanbul-lib-report'],
  format: 'cjs',
  outfile: './dist.cjs',
  platform: 'node',
  target: 'node20',
  treeShaking: true,
  tsconfig: './tsconfig.json',
});

await command.parseAsync();
