import pathlib from 'path';
import type { ResolvedBundle } from '@sourceacademy/modules-repotools/types';
import typedocPlugin from '@sourceacademy/modules-typedoc-plugin';
import chalk from 'chalk';
import * as td from 'typedoc';

// TODO: Remove the notExported option once we decide how to handle types being exported from bundles
// #region commonOpts
const typedocPackageOptions: td.Configuration.TypeDocOptions = {
  categorizeByGroup: false,
  disableSources: false,
  excludeInternal: true,
  skipErrorChecking: true,
  sort: ['documents-last'],
  useTsLinkResolution: true,
  validation: {
    notExported: false,
  },
  visibilityFilters: {},
  // @publicType/@publicReturnType are read and stripped by normalizeSignature() in
  // conductor/normalisation.ts; register them so Typedoc doesn't warn about unknown block tags.
  blockTags: [...td.OptionDefaults.blockTags, '@publicType', '@publicReturnType'],
};
// #endregion commonOpts

/**
 * Custom Typedoc logger that prepends the name of the module
 * before each log message to make it clearer
 */
class CustomLogger extends td.ConsoleLogger {
  constructor(
    public readonly moduleName: string
  ) {
    super();
  }

  static logLevelColourer = {
    [td.LogLevel.Error]: chalk.redBright,
    [td.LogLevel.Warn]: chalk.yellowBright,
    [td.LogLevel.Info]: chalk.cyanBright,
    [td.LogLevel.Verbose]: chalk.grey
  };

  static messagePrefixes = {
    [td.LogLevel.Error]: 'error',
    [td.LogLevel.Warn]: 'warning',
    [td.LogLevel.Info]: 'info',
    [td.LogLevel.Verbose]: 'debug',
  };

  override addContext(message: string, level: Exclude<td.LogLevel, td.LogLevel.None>, ..._args: any[]): string {
    const colourer = CustomLogger.logLevelColourer[level];
    const prefix = CustomLogger.messagePrefixes[level];

    const fullPrefix = colourer(`[${prefix} ${chalk.magentaBright(`(${this.moduleName})`)}]`);
    return `${fullPrefix} ${message}`;
  }
}

/**
 * Typedoc wants the format of each path to be that of the OS its running on, but with
 * POSIX path separators. This function converts any path to that format.
 */
export function convertToTypedocPath(p: string) {
  return p.split(pathlib.sep).join(pathlib.posix.sep);
}

/**
 * Removes source locations after Conductor decorator parsing has used them.
 */
export function stripTypeDocSources(reflection: td.Reflection) {
  (reflection as { sources?: td.SourceReference[] }).sources = undefined;
  reflection.traverse(child => {
    stripTypeDocSources(child);
  });
}

/**
 * Initialize Typedoc to build the JSON documentation for each bundle
 */
export async function initTypedocForJson(bundle: ResolvedBundle, outDir: string, logLevel: td.LogLevel) {
  const bundleDirPosix = convertToTypedocPath(bundle.directory);
  const outDirPosix = convertToTypedocPath(outDir);
  const tsconfigPath = pathlib.posix.join(bundleDirPosix, 'tsconfig.json');

  const app = await td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [
      pathlib.posix.join(bundleDirPosix, 'src', 'index.ts')
    ],
    tsconfig: tsconfigPath,
    plugin: [typedocPlugin],
    outputs: [
      {
        name: 'json',
        path: `${bundleDirPosix}/dist/docs.json`
      },
      {
        name: 'source-json',
        path: `${outDirPosix}/jsons/${bundle.name}.json`
      }
    ]
  });

  app.logger = new CustomLogger(bundle.name);

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
    favicon: pathlib.join(import.meta.dirname, 'favicon.ico'),
    readme: pathlib.join(import.meta.dirname, 'docsreadme.md'),
    navigation: {
      includeCategories: true
    }
  });
}
