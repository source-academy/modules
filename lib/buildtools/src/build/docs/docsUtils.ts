import * as td from 'typedoc';
import type { ResolvedBundle } from '../manifest';
import { getBundlesDir } from '../../utils';
import pathlib from 'path';

const commonTypedocOptions: td.Configuration.TypeDocOptions = {
  categorizeByGroup: true,
  disableSources: true,
  excludeInternal: true,
  logLevel: 'Error',
  skipErrorChecking: true,
}


/**
 * Initialize typedoc for a single bundle. Useful for building the JSON
 * documentation for a single bundle without having to process every other
 * bundle
 */
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

/**
 * Initialize typedoc for all bundles at once. Useful for building HTML documentation,
 * but can also be used to build the JSON documentation of every single bundle.
 * 
 * More efficient than having to initialize typedoc separately each time
 */
export async function initTypedoc(manifest: Record<string, ResolvedBundle>) {
  const entryPoints = Object.values(manifest).map(({ entryPoint }) => entryPoint)
  const bundlesDir = await getBundlesDir()
  const tsconfigPath = pathlib.resolve(bundlesDir, 'tsconfig.json')

  const app = await td.Application.bootstrap({
    ...commonTypedocOptions,
    alwaysCreateEntryPointModule: true,
    entryPoints,
    name: 'Source Academy Modules',
    readme: `${__dirname}/docsreadme.md`,
    tsconfig: tsconfigPath,
  });

  const project = await app.convert();
  if (!project) {
    throw new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!');
  }
  return [project, app] as [td.ProjectReflection, td.Application];
}

export type TypedocInitResult = Awaited<ReturnType<typeof initTypedoc>>;
