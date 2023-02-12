import chalk from 'chalk';

import { printList } from '../../scriptUtils.js';
import { createBuildCommand, logResult, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logTscResults, runTsc } from '../prebuild/tsc.js';
import type { BuildCommandInputs } from '../types.js';

import { initTypedoc, logTypedocTime } from './docUtils.js';
import { buildHtml, logHtmlResult } from './html.js';
import { buildJsons } from './json.js';

export const docsCommandHandler = async (modules: string[] | null, { manifest, srcDir, outDir, verbose, tsc }: Omit<BuildCommandInputs, 'modules' | 'tabs'>) => {
  const { bundles } = await retrieveBundlesAndTabs(manifest, modules, [], false);
  if (bundles.length === 0) return;

  if (tsc) {
    const tscResult = await runTsc(srcDir, {
      bundles,
      tabs: [],
    });
    logTscResults(tscResult, srcDir);
    if (tscResult.result.severity === 'error') return;
  }

  printList(`${chalk.cyanBright('Building HTML documentation and jsons for the following bundles:')}\n`, bundles);

  const { elapsed, result: [app, project] } = await initTypedoc({
    bundles,
    srcDir,
    verbose,
  });
  const [jsonResults, htmlResult] = await Promise.all([
    buildJsons(project, {
      outDir,
      bundles,
    }),
    buildHtml(app, project, {
      outDir,
      modulesSpecified: modules !== null,
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
