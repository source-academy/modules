import * as td from 'typedoc';
import type { ResolvedBundle } from '../../types.js';

// #region commonOpts
const typedocPackageOptions: td.Configuration.TypeDocPackageOptions = {
  categorizeByGroup: true,
  disableSources: true,
  excludeInternal: true,
  skipErrorChecking: true,
  sort: ['documents-last'],
};

const commonTypedocOptions: td.Configuration.TypeDocOptions = {
  visibilityFilters: {},
};
// #endregion commonOpts

type InitTypedocResult = {
  severity: 'success'
  reflection: td.ProjectReflection
} | {
  severity: 'error',
  message: string
};

/**
 * Initialize typedoc for a single bundle. Useful for building the JSON
 * documentation for a single bundle without having to process every other
 * bundle
 */
export async function initTypedocForSingleBundle(bundle: ResolvedBundle, logLevel: td.LogLevel): Promise<InitTypedocResult> {
  const app = await td.Application.bootstrapWithPlugins({
    ...commonTypedocOptions,
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [`${bundle.directory}/src/index.ts`],
    tsconfig: `${bundle.directory}/tsconfig.json`,
  });

  const reflection = await app.convert();
  if (!reflection) {
    return {
      severity: 'error',
      message: `Failed to generate reflection for ${bundle.name}, check that the bundle has no type errors!`
    };
  }

  if (app.logger.hasErrors()) {
    return {
      severity: 'error',
      message: 'Refer to the console for Typedoc errors'
    };
  }

  return {
    severity: 'success',
    reflection
  };
}

/**
 * Initialize typedoc for all bundles at once. Useful for building HTML documentation,
 * but can also be used to build the JSON documentation of every single bundle.
 *
 * More efficient than having to initialize typedoc separately each time
 */
export async function initTypedoc(manifest: Record<string, ResolvedBundle>, logLevel: td.LogLevel) {
  const entryPoints = Object.values(manifest).map(({ directory }) => directory);
  const app = await td.Application.bootstrapWithPlugins({
    ...commonTypedocOptions,
    alwaysCreateEntryPointModule: true,
    entryPoints,
    entryPointStrategy: 'packages',
    packageOptions: {
      ...typedocPackageOptions,
      entryPoints: ['src/index.ts'],
    },
    name: 'Source Academy Modules',
    logLevel,
    readme: `${import.meta.dirname}/docsreadme.md`,
  });

  const project = await app.convert();
  if (!project) {
    throw new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!');
  }
  return [project, app] as [td.ProjectReflection, td.Application];
}

export type TypedocInitResult = Awaited<ReturnType<typeof initTypedoc>>;
