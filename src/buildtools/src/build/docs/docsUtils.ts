import * as td from 'typedoc';
import type { ResolvedBundle } from '../manifest';
import { getGitRoot } from '../../utils';
import pathlib from 'path';

const commonTypedocOptions: td.Configuration.TypeDocOptions = {
  categorizeByGroup: true,
  disableSources: true,
  excludeInternal: true,
  logLevel: 'Error',
  skipErrorChecking: true,
}

export async function initTypedocForSingleBundle(bundle: ResolvedBundle) {
  const app = await td.Application.bootstrap({
    ...commonTypedocOptions,
    name: bundle.name,
    entryPoints: [bundle.entryPoint],
    tsconfig: `${bundle.directory}/tsconfig.json`,
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
  const tsconfigPath = pathlib.resolve(gitRoot, 'src', 'bundles', 'tsconfig.json')

  const app = await td.Application.bootstrap({
    ...commonTypedocOptions,
    alwaysCreateEntryPointModule: true,
    entryPoints,
    name: 'Source Academy Modules',
    readme: `${import.meta.dirname}/docsreadme.md`,
    tsconfig: tsconfigPath,
  });

  const project = await app.convert();
  if (!project) {
    throw new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!');
  }
  return [project, app] as [td.ProjectReflection, td.Application];
}

export type TypedocInitResult = Awaited<ReturnType<typeof initTypedoc>>;
