import fs from 'fs/promises';
import pathlib from 'path';
import type { BuildResult, ResolvedBundle, ResultType } from '@sourceacademy/modules-repotools/types';
import { mapAsync } from '@sourceacademy/modules-repotools/utils';
import * as td from 'typedoc';
import { buildJson } from './json.js';
import { initTypedocForHtml, initTypedocForJson } from './typedoc.js';

/**
 * First builds an intermediate JSON file in the dist directory of the bundle\
 * Then it builds the JSON documentation for that bundle
 */
export async function buildSingleBundleDocs(bundle: ResolvedBundle, outDir: string, logLevel: td.LogLevel): Promise<BuildResult> {
  const app = await initTypedocForJson(bundle, logLevel);

  const project = await app.convert();
  if (!project) {
    return {
      type: 'docs',
      severity: 'error',
      errors: [`Failed to generate reflection for ${bundle.name}, check that the bundle has no type errors!`],
      input: bundle
    };
  }

  // TypeDoc expects POSIX paths
  const directoryAsPosix = bundle.directory.replace(/\\/g, '/');
  await app.generateJson(project, `${directoryAsPosix}/dist/docs.json`);

  if (app.logger.hasErrors()) {
    return {
      type: 'docs',
      severity: 'error',
      errors: ['Refer to the command line for Typedoc\'s error messages'],
      input: bundle
    };
  }

  await fs.mkdir(pathlib.join(outDir, 'jsons'), { recursive: true });
  return buildJson(bundle, outDir, project);
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
