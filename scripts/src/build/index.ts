import chalk from 'chalk';
import { Command } from 'commander';

import { printList } from '../scriptUtils.js';

import { logTypedocTime } from './docs/docUtils.js';
import getBuildDocsCommand, {
  buildHtml,
  buildJsons,
  getBuildHtmlCommand,
  getBuildJsonCommand,
  initTypedoc,
  logHtmlResult,
} from './docs/index.js';
import getBuildModulesCommand, {
  buildModules,
  getBuildTabsCommand,
} from './modules/index.js';
import { prebuild } from './prebuild/index.js';
import type { LintCommandInputs } from './prebuild/lint.js';
import { copyManifest, createBuildCommand, createOutDir, exitOnError, logResult, retrieveBundlesAndTabs } from './buildUtils.js';
import type { BuildCommandInputs } from './types.js';

export const getBuildAllCommand = () => createBuildCommand('all', true)
  .argument('[modules...]', 'Manually specify which modules to build', null)
  .action(async (modules: string[] | null, opts: BuildCommandInputs & LintCommandInputs) => {
    const [assets] = await Promise.all([
      retrieveBundlesAndTabs(opts.manifest, modules, null),
      createOutDir(opts.outDir),
    ]);
    await prebuild(opts, assets);

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
              modulesSpecified: modules !== null,
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
    exitOnError(results, ...jsonResults, htmlResult.result);
  })
  .description('Build bundles, tabs, jsons and HTML documentation');

export default new Command('build')
  .description('Run without arguments to build all, or use a specific build subcommand')
  .addCommand(getBuildAllCommand(), { isDefault: true })
  .addCommand(getBuildDocsCommand())
  .addCommand(getBuildHtmlCommand())
  .addCommand(getBuildJsonCommand())
  .addCommand(getBuildModulesCommand())
  .addCommand(getBuildTabsCommand());
