import pathlib from 'path';
import * as td from 'typedoc';
import type { ResolvedBundle } from '../../types.js';

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
  // TypeDoc expects POSIX paths
  const directoryAsPosix = bundle.directory.replace(/\\/g, '/');
  return td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [`${directoryAsPosix}/src/index.ts`],
    tsconfig: `${directoryAsPosix}/tsconfig.json`,
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
    entryPoints: Object.values(bundles).map(({ directory }) => {
      // TypeDoc expects POSIX paths
      const directoryAsPosix = directory.replace(/\\/g, '/');
      return `${directoryAsPosix}/dist/docs.json`;
    }),
    entryPointStrategy: 'merge',
    readme: pathlib.join(import.meta.dirname, 'docsreadme.md'),
  });
}
