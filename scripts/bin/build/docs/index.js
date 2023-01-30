import chalk from 'chalk';
import { Command } from 'commander';
import { printList } from '../../scriptUtils.js';
import { retrieveBundlesAndTabs } from '../buildUtils.js';
import { initTypedoc, logTypedocTime } from './docUtils.js';
import { buildHtml, logHtmlResult } from './html.js';
import { buildJsons, logJsonResults } from './json.js';
const buildDocsCommand = new Command('docs')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--outDir <outdir>', 'Source directory for files', 'build')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('-v, --verbose', 'Display more information about the build results', false)
    .argument('[modules...]', 'Modules to build jsons for', null)
    .description('Build only jsons and HTML documentation')
    .action(async (modules, opts) => {
    const { bundles, modulesSpecified } = await retrieveBundlesAndTabs(opts.manifest, modules, []);
    if (bundles.length === 0)
        return;
    printList(`${chalk.magentaBright('Building HTML documentation and jsons for the following bundles:')}\n`, bundles);
    const { elapsed, result: [app, project] } = await initTypedoc({
        srcDir: opts.srcDir,
        bundles,
        verbose: opts.verbose,
    });
    const [jsonResults, htmlResult] = await Promise.all([
        buildJsons(project, {
            bundles,
            outDir: opts.outDir,
        }),
        buildHtml(app, project, {
            modulesSpecified,
            outDir: opts.outDir,
        }),
        // app.generateJson(project, `${buildOpts.outDir}/docs.json`),
    ]);
    logTypedocTime(elapsed);
    if (!jsonResults && !htmlResult)
        return;
    logHtmlResult(htmlResult);
    logJsonResults(jsonResults, opts.verbose);
})
    .description('Build only jsons and HTML documentation');
export default buildDocsCommand;
export { default as buildHtmlCommand, logHtmlResult, buildHtml } from './html.js';
export { default as buildJsonCommand, logJsonResults, buildJsons } from './json.js';
export { initTypedoc } from './docUtils.js';
