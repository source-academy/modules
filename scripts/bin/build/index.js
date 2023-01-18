import chalk from 'chalk';
import { Command } from 'commander';
import { logTypedocTime } from './docs/docUtils';
import { createBuildCommand } from './buildUtils';
import buildDocsCommand, { buildHtml, buildHtmlCommand, buildJsonCommand, buildJsons, initTypedoc, logHtmlResult, logJsonResults, } from './docs';
import buildModulesCommand, { buildModules, buildTabsCommand, logBundleResults, logTabResults } from './modules';
const buildAllCommand = createBuildCommand('all', async (buildOpts) => {
    console.log(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n${buildOpts.bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')}\n`);
    const [{ bundles: bundleResults, tabs: tabResults }, { typedoctime, html: htmlResult, json: jsonResults, }] = await Promise.all([
        buildModules(buildOpts),
        initTypedoc(buildOpts)
            .then(async ({ elapsed, result: [app, project] }) => {
            const [json, html] = await Promise.all([
                buildJsons(project, buildOpts),
                buildHtml(app, project, buildOpts),
            ]);
            return {
                json: {
                    elapsed: json.elapsed,
                    results: json.result,
                },
                html,
                typedoctime: elapsed,
            };
        }),
    ]);
    logTypedocTime(typedoctime);
    logBundleResults(bundleResults);
    logTabResults(tabResults);
    logJsonResults(jsonResults);
    logHtmlResult(htmlResult);
})
    .description('Build bundles, tabs, jsons and HTML documentation');
export default new Command('build')
    .description('Run without arguments to build all, or use a specific build subcommand')
    .addCommand(buildAllCommand, { isDefault: true })
    .addCommand(buildDocsCommand)
    .addCommand(buildHtmlCommand)
    .addCommand(buildJsonCommand)
    .addCommand(buildModulesCommand)
    .addCommand(buildTabsCommand);
// export const watchAll = async (buildOpts: BuildOptions) => {
//   const manifest = await retrieveManifest(buildOpts);
//   const bundlesToBuild = Object.keys(manifest);
//   const tabs = Object.values(manifest)
//     .flatMap((module) => module.tabs);
//   console.log(chalk.magentaBright('Beginning watch'));
//   await Promise.all([
//     initTypedoc(bundlesToBuild, buildOpts)
//       .then(({ elapsed, result: [, project] }) => {
//         console.log(chalk.cyanBright(`Took ${divideAndRound(elapsed, 1000, 2)}s to initialize typedoc`));
//         return watchBundles(buildOpts, project, bundlesToBuild);
//       }),
//     watchTabs(buildOpts, tabs),
//   ]);
// };
