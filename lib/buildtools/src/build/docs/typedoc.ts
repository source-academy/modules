import pathlib from 'path';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import * as td from 'typedoc';

// #region commonOpts
const typedocPackageOptions: td.Configuration.TypeDocOptions = {
  categorizeByGroup: true,
  disableSources: true,
  excludeInternal: true,
  skipErrorChecking: true,
  sort: ['documents-last'],
  visibilityFilters: {},
};
// #endregion commonOpts

/**
 * Initialize Typedoc to build the JSON documentation for each bundle
 */
export function initTypedocForJson(bundle: ResolvedBundle, logLevel: td.LogLevel) {
  return td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [pathlib.join(bundle.directory, 'src', 'index.ts')],
    tsconfig: pathlib.join(bundle.directory, 'tsconfig.json')
  });
}

/**
 * Initialize Typedoc to build HTML documentation after the documentation for each bundle
 * has been built separately.
 */
export function initTypedocForHtml(bundles: Record<string, ResolvedBundle>, logLevel: td.LogLevel) {
  return td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: 'Source Academy Modules',
    logLevel,
    entryPoints: Object.values(bundles).map(({ directory }) => pathlib.join(directory, 'dist', 'docs.json')),
    entryPointStrategy: 'merge',
    readme: pathlib.join(import.meta.dirname, 'docsreadme.md'),
  });
}
