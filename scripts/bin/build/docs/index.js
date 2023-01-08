import chalk from 'chalk';
import { createBuildCommand } from '../buildUtils';
import { initTypedoc, logTypedocTime } from './docUtils';
import { buildHtml, logHtmlResult } from './html';
import { buildJsons, logJsonResults } from './json';
const buildDocsCommand = createBuildCommand('docs', async (buildOpts) => {
    if (buildOpts.bundles.length === 0)
        return;
    console.log(`${chalk.cyanBright('Building HTML documentation and jsons for the following bundles:')}\n${buildOpts.bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')}\n`);
    const { elapsed, result: [app, project] } = await initTypedoc(buildOpts);
    const [jsonResults, htmlResult] = await Promise.all([
        buildJsons(project, buildOpts),
        buildHtml(app, project, buildOpts),
        // app.generateJson(project, `${buildOpts.outDir}/docs.json`),
    ]);
    logTypedocTime(elapsed);
    if (!jsonResults && !htmlResult)
        return;
    logHtmlResult(htmlResult);
    logJsonResults({
        elapsed: jsonResults.elapsed,
        results: jsonResults.result,
    });
})
    .description('Build only jsons and HTML documentation');
export default buildDocsCommand;
export { default as buildHtmlCommand, logHtmlResult, buildHtml } from './html';
export { default as buildJsonCommand, logJsonResults, buildJsons } from './json';
export { initTypedoc } from './docUtils';
