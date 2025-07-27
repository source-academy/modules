/**
 * Script for building buildtools
 */

// @ts-check
import getBuildCommand from '@sourceacademy/lib-compiler';

const command = getBuildCommand({
  entryPoints: ['./src/commands/index.ts'],
  banner: {
    js: '#!/usr/bin/node'
  },
  bundle: true,
  format: 'esm',
  outfile: './bin/index.js',
  packages: 'external',
  platform: 'node',
  target: 'node20',
  tsconfig: './tsconfig.json',
});

await command.parseAsync();
