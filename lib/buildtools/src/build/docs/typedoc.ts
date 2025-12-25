import pathlib from 'path';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import { convertToPosixPath } from '@sourceacademy/modules-repotools/utils';
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
export async function initTypedocForJson(bundle: ResolvedBundle, logLevel: td.LogLevel) {
  // TypeDoc expects POSIX paths
  const directoryAsPosix = convertToPosixPath(bundle.directory);
  const app = await td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [`${directoryAsPosix}/src/index.ts`],
    tsconfig: `${directoryAsPosix}/tsconfig.json`,
  });

  app.converter.on(td.Converter.EVENT_CREATE_SIGNATURE, (ctx, signature) => {
    // Make sure that type guards get replaced with the appropriate intrinsic types
    if (signature.type instanceof td.PredicateType) {
      if (signature.type.asserts) {
        signature.type = new td.IntrinsicType('void');
      } else {
        signature.type = new td.IntrinsicType('boolean');
      }
    }
  });

  return app;
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
      const directoryAsPosix = convertToPosixPath(directory);
      return `${directoryAsPosix}/dist/docs.json`;
    }),
    entryPointStrategy: 'merge',
    readme: pathlib.join(import.meta.dirname, 'docsreadme.md'),
  });
}
