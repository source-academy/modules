import getBuildCommand from '@sourceacademy/modules-repotools/builder';

const buildCommand = getBuildCommand({
  bundle: true,
  entryPoints: ['./index.ts'],
  format: 'esm',
  outfile: './dist.js',
  packages: 'external'
});

await buildCommand.parseAsync();
