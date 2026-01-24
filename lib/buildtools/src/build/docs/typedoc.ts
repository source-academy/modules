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
 * Typedoc wants the format of each path to be that of the OS its running on, but with
 * POSIX path separators. This function converts any path to that format.
 */
export function convertToTypedocPath(p: string) {
  return p.split(pathlib.sep).join(pathlib.posix.sep);
}

/**
 * Initialize Typedoc to build the JSON documentation for each bundle
 */
export async function initTypedocForJson(bundle: ResolvedBundle, logLevel: td.LogLevel) {
  const directoryAsPosix = convertToTypedocPath(bundle.directory);

  const app = await td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [
      pathlib.posix.join(directoryAsPosix, 'src', 'index.ts')
    ],
    tsconfig: pathlib.posix.join(directoryAsPosix, 'tsconfig.json'),
  });

  app.converter.on(td.Converter.EVENT_CREATE_SIGNATURE, (_ctx, signature) => {
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
      const directoryAsPosix = convertToTypedocPath(directory);
      return pathlib.posix.join(directoryAsPosix, 'dist', 'docs.json');
    }),
    entryPointStrategy: 'merge',
    readme: pathlib.join(import.meta.dirname, 'docsreadme.md'),
  });
}
