import chalk from 'chalk';

import { printList } from '../../scriptUtils.js';
import { createBuildCommand, logResult, retrieveBundlesAndTabs } from '../buildUtils.js';
import type { LintCommandInputs } from '../prebuild/eslint.js';
import { autoLogPrebuild } from '../prebuild/index.js';
import type { BuildCommandInputs } from '../types.js';

import { initTypedoc, logTypedocTime } from './docUtils.js';
import { buildHtml, logHtmlResult } from './html.js';
import { buildJsons } from './json.js';

export const docsCommandHandler = async (modules: string[] | null, { manifest, srcDir, outDir, verbose, ...opts }: Omit<BuildCommandInputs, 'modules' | 'tabs'> & LintCommandInputs) => {
  const assets = await retrieveBundlesAndTabs(manifest, modules, [], false);
  if (assets.bundles.length === 0) return;

  const proceed = await autoLogPrebuild({
    srcDir,
    ...opts,
  }, assets);
  if (!proceed) return;

  printList(`${chalk.cyanBright('Building HTML documentation and jsons for the following bundles:')}\n`, assets.bundles);

  const { elapsed, result: [app, project] } = await initTypedoc({
    bundles: assets.bundles,
    srcDir,
    verbose,
  });
  const [jsonResults, htmlResult] = await Promise.all([
    buildJsons(project, {
      outDir,
      bundles: assets.bundles,
    }),
    buildHtml(app, project, {
      outDir,
      modulesSpecified: assets.modulesSpecified,
    }),
    // app.generateJson(project, `${buildOpts.outDir}/docs.json`),
  ]);

  logTypedocTime(elapsed);
  if (!jsonResults && !htmlResult) return;

  logHtmlResult(htmlResult);
  logResult(jsonResults, verbose);
};

const buildDocsCommand = createBuildCommand('docs', true)
  .argument('[modules...]', 'Manually specify which modules to build documentation', null)
  .action(docsCommandHandler)
  .description('Build only jsons and HTML documentation');

export default buildDocsCommand;
export { default as buildHtmlCommand, logHtmlResult, buildHtml } from './html.js';
export { default as buildJsonCommand, buildJsons } from './json.js';
export { initTypedoc } from './docUtils.js';
