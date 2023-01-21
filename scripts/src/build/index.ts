import chalk from 'chalk';
import { Command } from 'commander';

import { logTypedocTime } from './docs/docUtils.js';
import buildDocsCommand, {
  buildHtml,
  buildHtmlCommand,
  buildJsonCommand,
  buildJsons,
  initTypedoc,
  logHtmlResult,
  logJsonResults,
} from './docs/index.js';
import buildModulesCommand, {
  buildModules,
  buildTabsCommand, logBundleResults, logTabResults,
} from './modules/index.js';
import { createBuildCommand } from './buildUtils.js';

const buildAllCommand = createBuildCommand('all', async (buildOpts) => {
  console.log(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n${
    buildOpts.bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
      .join('\n')
  }\n`);

  const [{ bundles: bundleResults, tabs: tabResults }, {
    typedoctime,
    html: htmlResult,
    json: jsonResults,
  }] = await Promise.all([
    buildModules(buildOpts),
    initTypedoc(buildOpts)
      .then(async ({ elapsed, result: [app, project] }) => {
        const [json, html] = await Promise.all([
          buildJsons(project, buildOpts),
          buildHtml(app, project, buildOpts),
        ]);
        return {
          json,
          html,
          typedoctime: elapsed,
        };
      }),
  ]);

  logTypedocTime(typedoctime);

  logBundleResults(bundleResults, buildOpts.verbose);
  logTabResults(tabResults, buildOpts.verbose);
  logJsonResults(jsonResults, buildOpts.verbose);
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
