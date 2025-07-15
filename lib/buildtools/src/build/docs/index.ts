import fs from 'fs/promises';
import * as td from 'typedoc';
import { Severity, type BuildResult, type ResolvedBundle, type ResultType } from '../../types.js';
import { mapAsync } from '../../utils.js';
import { buildJson } from './json.js';

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
 * First builds an intermediate JSON file in the dist directory of the bundle\
 * Then it builds the JSON documentation for that bundle
 */
export async function buildSingleBundleDocs(bundle: ResolvedBundle, outDir: string, logLevel: td.LogLevel): Promise<BuildResult> {
  const app = await td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: bundle.name,
    logLevel,
    entryPoints: [`${bundle.directory}/src/index.ts`],
    tsconfig: `${bundle.directory}/tsconfig.json`,
  });

  const project = await app.convert();
  if (!project) {
    return {
      type: 'docs',
      severity: Severity.ERROR,
      errors: [`Failed to generate reflection for ${bundle.name}, check that the bundle has no type errors!`],
      input: bundle
    };
  }

  await app.generateJson(project, `${bundle.directory}/dist/docs.json`);

  if (app.logger.hasErrors()) {
    return {
      type: 'docs',
      severity: Severity.ERROR,
      errors: ['Refer to the command line for Typedoc\'s error messages'],
      input: bundle
    };
  }

  await fs.mkdir(`${outDir}/jsons`, { recursive: true });
  return buildJson(bundle, outDir, project);
}

type BuildAllBundleDocsResult = ResultType;

/**
 * Builds HTML documentation for all bundles. Needs to be run after {@link buildSingleBundleDocs}
 */
export async function buildHtml(bundles: Record<string, ResolvedBundle>, outDir: string, logLevel: td.LogLevel): Promise<BuildAllBundleDocsResult> {
  const jsonStats = await mapAsync(Object.values(bundles), async ({ name, directory }) => {
    try {
      const stats = await fs.stat(`${directory}/dist/docs.json`);
      return stats.isFile() ? undefined : name;
    } catch {
      return name;
    }
  });

  // Check if documentation for a specific bundle hasn't been built yet
  const missings = jsonStats.filter(each => each !== undefined);
  if (missings.length > 0) {
    return {
      severity: Severity.ERROR,
      errors: missings.map(each => `Could not find JSON documentation for ${each}`),
    };
  }

  const app = await td.Application.bootstrapWithPlugins({
    ...typedocPackageOptions,
    name: 'Source Academy Modules',
    logLevel,
    entryPoints: Object.values(bundles).map(({ directory }) => `${directory}/dist/docs.json`),
    entryPointStrategy: 'merge',
    readme: `${import.meta.dirname}/docsreadme.md`,
  });

  const project = await app.convert();
  if (!project) {
    return {
      severity: Severity.ERROR,
      errors: ['Failed to generate reflections, check that there are no type errors across all bundles!']
    };
  }

  await app.generateDocs(project, `${outDir}/documentation`);
  if (app.logger.hasErrors()) {
    return {
      severity: Severity.ERROR,
      errors: ['Refer to the command line for Typedoc\'s error messages']
    };
  }

  return {
    severity: Severity.SUCCESS,
    path: `${outDir}/documentation`,
  };
}
