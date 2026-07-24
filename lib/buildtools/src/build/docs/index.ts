import fs from 'fs/promises';
import pathlib from 'path';
import type { BuildResult, ResolvedBundle, ResultType } from '@sourceacademy/modules-repotools/types';
import { mapAsync } from '@sourceacademy/modules-repotools/utils';
import type * as td from 'typedoc';
import { normalizeConductorDocs } from './conductor/index.js';
import { initTypedocForHtml, initTypedocForJson, stripTypeDocSources } from './typedoc.js';

/**
 * First builds an intermediate JSON file in the dist directory of the bundle\
 * Then it builds the JSON documentation for that bundle
 */
export async function buildSingleBundleDocs(bundle: ResolvedBundle, outDir: string, logLevel: td.LogLevel): Promise<BuildResult> {
  const app = await initTypedocForJson(bundle, outDir, logLevel);

  const project = await app.convert();
  if (!project) {
    return {
      type: 'docs',
      severity: 'error',
      errors: [`Failed to generate reflection for ${bundle.name}, check that the bundle has no type errors!`],
      input: bundle
    };
  }

  normalizeConductorDocs(project);
  stripTypeDocSources(project);

  app.validate(project);
  await fs.mkdir(`${outDir}/jsons`, { recursive: true });
  await app.generateOutputs(project);

  if (app.logger.hasErrors()) {
    return {
      type: 'docs',
      severity: 'error',
      errors: ['Refer to the command line for Typedoc\'s error messages'],
      input: bundle
    };
  }

  const outpath = pathlib.join(outDir, 'jsons', `${bundle.name}.json`);
  if (app.logger.hasWarnings()) {
    return {
      type: 'docs',
      severity: 'warn',
      warnings: ['Refer to the command line for Typedoc\'s warning messages'],
      input: bundle,
      path: outpath
    };
  }

  return {
    type: 'docs',
    severity: 'success',
    input: bundle,
    path: outpath
  };
}

type BuildHtmlResult = ResultType;

/**
 * Builds HTML documentation for all bundles. Needs to be run after {@link buildSingleBundleDocs}
 */
export async function buildHtml(bundles: Record<string, ResolvedBundle>, outDir: string, logLevel: td.LogLevel): Promise<BuildHtmlResult> {
  const jsonStats = await mapAsync(Object.values(bundles), async ({ name, directory }) => {
    try {
      const stats = await fs.stat(pathlib.join(directory, 'dist', 'docs.json'));
      return stats.isFile() ? undefined : name;
    } catch {
      return name;
    }
  });

  // Check if documentation for a specific bundle hasn't been built yet
  const missings = jsonStats.filter(each => each !== undefined);
  if (missings.length > 0) {
    return {
      severity: 'error',
      errors: missings.map(each => `Could not find documentation for ${each}`),
    };
  }

  const app = await initTypedocForHtml(bundles, logLevel);

  const project = await app.convert();
  if (!project) {
    return {
      severity: 'error',
      errors: ['Failed to generate reflections, check that there are no type errors across all bundles!']
    };
  }

  normalizeConductorDocs(project);
  stripTypeDocSources(project);

  const htmlPath = pathlib.join(outDir, 'documentation');
  await app.generateDocs(project, htmlPath);
  if (app.logger.hasErrors()) {
    return {
      severity: 'error',
      errors: ['Refer to the command line for Typedoc\'s error messages']
    };
  }

  return {
    severity: 'success',
    path: htmlPath
  };
}
