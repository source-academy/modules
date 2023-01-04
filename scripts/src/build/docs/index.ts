import chalk from 'chalk';
import fs from 'fs/promises';
import type { Application, ProjectReflection } from 'typedoc';

import { type BuildOptions, retrieveManifest } from '../../scriptUtils';
import { divideAndRound } from '../buildUtils';

import { initTypedoc } from './docUtils';
import buildHtml, { logHtmlResult } from './html';
import buildJsons, { logJsonResults } from './json';

export const buildDocs = async (buildOpts: BuildOptions, app: Application, project: ProjectReflection, bundles: string[] | boolean) => {
  if (typeof bundles === 'boolean') {
    if (!bundles) return false;

    const manifest = await retrieveManifest(buildOpts);
    bundles = Object.keys(manifest);
  }

  if (bundles.length === 0) return false;

  await fs.mkdir(`${buildOpts.outDir}/jsons/`, { recursive: true });

  const [jsonResult, htmlResult] = await Promise.all([
    buildJsons(bundles, project, buildOpts),
    buildHtml(app, project, buildOpts),
  ]);

  return {
    html: htmlResult,
    json: jsonResult,
  };
};

export default async (buildOpts: BuildOptions) => {
  const manifest = await retrieveManifest(buildOpts);
  const bundles = Object.keys(manifest);

  console.log(`${chalk.cyanBright('Building HTML documentation and jsons for the following bundles:')}\n${
    bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
      .join('\n')
  }\n`);
  const { elapsed, result: [app, project] } = await initTypedoc(bundles, buildOpts);
  const results = await buildDocs(buildOpts, app, project, bundles);

  console.log(`${chalk.cyanBright('Took ')} ${divideAndRound(elapsed, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}`);
  if (!results) return;

  logHtmlResult(results.html);
  logJsonResults(results.json);
};

export { logHtmlResult } from './html';
export { logJsonResults } from './json';
export { initTypedoc } from './docUtils';
