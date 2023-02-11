import chalk from 'chalk';
import { Command } from 'commander';

import { printList } from '../scriptUtils.js';

import { logTypedocTime } from './docs/docUtils.js';
import buildDocsCommand, {
  buildHtml,
  buildHtmlCommand,
  buildJsonCommand,
  buildJsons,
  initTypedoc,
  logHtmlResult,
} from './docs/index.js';
import buildModulesCommand, {
  buildModules,
  buildTabsCommand,
} from './modules/index.js';
import type { LintCommandInputs } from './prebuild/eslint.js';
import { autoLogPrebuild } from './prebuild/index.js';
import { copyManifest, createBuildCommand, logResult, retrieveBundlesAndTabs } from './buildUtils.js';
import type { BuildCommandInputs } from './types.js';

const buildAllCommand = createBuildCommand('all', true)
  .argument('[modules...]', 'Manually specify which modules to build', null)
  .action(async (modules: string[] | null, opts: BuildCommandInputs & LintCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(opts.manifest, modules, null);
    const proceed = await autoLogPrebuild(opts, assets);
    if (!proceed) return;

    printList(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n`, assets.bundles);

    const [results, {
      typedoctime,
      html: htmlResult,
      json: jsonResults,
    }] = await Promise.all([
      buildModules(opts, assets),
      initTypedoc({
        ...opts,
        bundles: assets.bundles,
      })
        .then(async ({ elapsed, result: [app, project] }) => {
          const [json, html] = await Promise.all([
            buildJsons(project, {
              outDir: opts.outDir,
              bundles: assets.bundles,
            }),
            buildHtml(app, project, {
              outDir: opts.outDir,
              modulesSpecified: assets.modulesSpecified,
            }),
          ]);
          return {
            json,
            html,
            typedoctime: elapsed,
          };
        }),
      copyManifest(opts),
    ]);

    logTypedocTime(typedoctime);

    logResult(results.concat(jsonResults), opts.verbose);
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
