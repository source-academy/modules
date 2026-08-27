/**
 * Script for building lintplugin
 */

// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const command = getBuildCommand({
  entryPoints: [
    { in: './src/index.ts', out: './index' },
    { in: './src/formatter.ts', out: './formatter' }
  ],
  bundle: true,
  format: 'esm',
  outdir: './dist',
  packages: 'external',
  platform: 'node',
  target: 'node20',
  tsconfig: './tsconfig.json'
});

await command.parseAsync();
