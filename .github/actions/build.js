// @ts-check
import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const buildCommand = getBuildCommand({
  bundle: true,
  entryPoints: [
    { in: './src/info/index.ts', out: 'info' },
    { in: './src/load-artifacts/index.ts', out: 'load' },
    { in: './src/playwright-cache/index.ts', out: 'playwright' },
  ],
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  platform: 'node',
  target: 'node20',
});

await buildCommand.parseAsync();
