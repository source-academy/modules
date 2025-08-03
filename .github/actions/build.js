import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const buildCommand = getBuildCommand({
  bundle: true,
  entryPoints: [
    { in: './src/info/index.ts', out: 'info' },
    { in: './src/install-deps/index.ts', out: 'install-deps' },
  ],
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  target: 'node20'
});

await buildCommand.parseAsync();
