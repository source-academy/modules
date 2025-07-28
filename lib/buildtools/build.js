/**
 * Script for building buildtools
 */

// @ts-check
import pathlib from 'path';
import getBuildCommand from '@sourceacademy/lib-compiler';

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
  target: 'node20',
  tsconfig: './tsconfig.json',
  plugins: [{
    name: 'Local Externalizer',
    setup({ onResolve }) {
      onResolve({
        filter: /^\.{1,2}(\/.+)?/
      }, args => {
        const absolutePath = pathlib.resolve(args.resolveDir, args.path);
        const { dir, ext, base } = pathlib.parse(absolutePath);
        if (ext === '.json' || dir !== repoRoot) return undefined;

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
