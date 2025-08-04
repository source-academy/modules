// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const buildCommand = getBuildCommand({
  bundle: true,
  entryPoints: [
    { in: './src/info/index.ts', out: 'info' },
  ],
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  platform: 'node',
  target: 'node20',
});

await buildCommand.parseAsync();
