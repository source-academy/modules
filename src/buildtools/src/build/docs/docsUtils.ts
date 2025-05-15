import * as td from 'typedoc';
import type { ResolvedBundle } from '../modules/manifest';
import { getGitRoot } from '../../utils';
import pathlib from 'path';

export async function initTypedocForSingleBundle(bundle: ResolvedBundle) {
  const app = await td.Application.bootstrap({
    name: bundle.name,
    categorizeByGroup: true,
    entryPoints: [bundle.entryPoint],
    excludeInternal: true,
    logLevel: 'Error',
    tsconfig: `${bundle.directory}/tsconfig.json`,
    skipErrorChecking: true,
  });

  const reflection = await app.convert()
  if (!reflection) {
    throw new Error(`Failed to generate reflection for ${bundle.name}, check that the bundle has no type errors!`)
  }

  return reflection
}

export async function initTypedoc(manifest: Record<string, ResolvedBundle>) {
  const entryPoints = Object.values(manifest).map(({ entryPoint }) => entryPoint)
  const gitRoot = await getGitRoot()
  const readme = pathlib.resolve(gitRoot, 'src', 'buildtools', 'src', 'build', 'docs', 'docsreadme.md')
  const tsconfigPath = pathlib.resolve(gitRoot, 'src', 'bundles', 'tsconfig.json')

  const app = await td.Application.bootstrap({
    alwaysCreateEntryPointModule: true,
    categorizeByGroup: true,
    entryPoints,
    excludeInternal: true,
    logLevel: 'Error',
    name: 'Source Academy Modules',
    readme,
    skipErrorChecking: true,
    tsconfig: tsconfigPath
  });


  const project = await app.convert();
  if (!project) {
    throw new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!');
  }
  return [project, app] as [td.ProjectReflection, td.Application];
}

export type TypedocInitResult = Awaited<ReturnType<typeof initTypedoc>>;
