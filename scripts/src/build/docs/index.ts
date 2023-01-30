import chalk from 'chalk';

import { createBuildCommand, logResult, retrieveBundlesAndTabs } from '../buildUtils.js';
import type { BuildCommandInputs } from '../types.js';

import { initTypedoc, logTypedocTime } from './docUtils.js';
import { buildHtml, logHtmlResult } from './html.js';
import { buildJsons } from './json.js';

// TODO: Remove tsc and linting options
const buildDocsCommand = createBuildCommand('docs')
  .argument('[modules...]', 'Manually specify which modules to build documentation', null)
  .action(async (modules: string[] | null, { manifest, srcDir, outDir, verbose }: BuildCommandInputs) => {
    const { bundles, modulesSpecified } = await retrieveBundlesAndTabs(manifest, modules, [], false);
    if (bundles.length === 0) return;

    console.log(`${chalk.cyanBright('Building HTML documentation and jsons for the following bundles:')}\n${
      bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')
    }\n`);

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
        modulesSpecified,
      }),
    // app.generateJson(project, `${buildOpts.outDir}/docs.json`),
    ]);

    logTypedocTime(elapsed);
    if (!jsonResults && !htmlResult) return;

    logHtmlResult(htmlResult);
    logResult(jsonResults, verbose);
  })
  .description('Build only jsons and HTML documentation');

export default buildDocsCommand;
export { default as buildHtmlCommand, logHtmlResult, buildHtml } from './html.js';
export { default as buildJsonCommand, buildJsons } from './json.js';
export { initTypedoc } from './docUtils.js';
