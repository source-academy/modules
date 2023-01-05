import chalk from 'chalk';
import fs from 'fs/promises';
import { divideAndRound } from '../buildUtils';
import { initTypedoc } from './docUtils';
import buildHtml, { logHtmlResult } from './html';
import buildJsons, { logJsonResults } from './json';
export const buildDocs = async (buildOpts, app, project) => {
    const bundles = buildOpts.modules;
    if (bundles.length === 0)
        return false;
    await fs.mkdir(`${buildOpts.outDir}/jsons/`, { recursive: true });
    const [jsonResult, htmlResult] = await Promise.all([
        buildJsons(project, buildOpts),
        buildHtml(app, project, buildOpts),
    ]);
    return {
        html: htmlResult,
        json: jsonResult,
    };
};
export default async (buildOpts) => {
    const bundles = buildOpts.modules;
    console.log(`${chalk.cyanBright('Building HTML documentation and jsons for the following bundles:')}\n${bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')}\n`);
    const { elapsed, result: [app, project] } = await initTypedoc(buildOpts);
    const results = await buildDocs(buildOpts, app, project);
    await app.generateJson(project, `${buildOpts.outDir}/docs.json`);
    console.log(`${chalk.cyanBright('Took')} ${divideAndRound(elapsed, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}`);
    if (!results)
        return;
    logHtmlResult(results.html);
    logJsonResults(results.json);
};
export { logHtmlResult } from './html';
export { logJsonResults } from './json';
export { initTypedoc } from './docUtils';
