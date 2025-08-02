/**
 * Script for building buildtools
 */

// @ts-check
import pathlib from 'path';
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const repoRoot = pathlib.resolve(import.meta.dirname, '../..');

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
  tsconfig: './tsconfig.json',
  plugins: [{
    // If the given path resolves to something in the root of the repository
    // then replace the path and externalize the import instead
    name: 'Local Externalizer',
    setup({ onResolve }) {
      onResolve({
        filter: /^\.{1,2}(\/.+)?/
      }, args => {
        const absolutePath = pathlib.resolve(args.resolveDir, args.path);
        const { dir, base } = pathlib.parse(absolutePath);
        if (dir !== repoRoot) return undefined;

        // The new import path should be relative to the bin/index.js file
        const newDirectory = pathlib.relative('./bin', repoRoot);
        return {
          external: true,
          path: pathlib.join(newDirectory, base),
        };
      });
    }
  }]
});

await command.parseAsync();
