import chalk from 'chalk';
import { Command, Option } from 'commander';

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
import { logLintResult } from './prebuild/eslint.js';
import { preBuild } from './prebuild/index.js';
import { logTscResults } from './prebuild/tsc.js';
import { retrieveBundlesAndTabs } from './buildUtils.js';
import type { BuildCommandInputs } from './types.js';

const buildAllCommand = new Command('all')
  .option('--fix', 'Ask eslint to autofix linting errors', false)
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--outDir <outdir>', 'Source directory for files', 'build')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-v, --verbose', 'Display more information about the build results', false)
  .option('--no-tsc', 'Don\'t run tsc before building')
  .addOption(new Option('--no-lint', 'Don\t run eslint before building')
    .conflicts('fix'))
  .argument('[modules...]', 'Manually specify which modules to build', null)
  .action(async (modules: string[] | null, buildOpts: BuildCommandInputs & { fix: boolean }) => {
    const assets = await retrieveBundlesAndTabs(buildOpts.manifest, modules, []);

    const { lintResult, tscResult, proceed } = await preBuild(buildOpts, assets);

    logLintResult(lintResult);
    logTscResults(tscResult);

    if (!proceed) return;

    console.log(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n${
      assets.bundles.map((bundle, i) => `${i + 1}. ${bundle}`)
        .join('\n')
    }\n`);

    const [{ bundles: bundleResults, tabs: tabResults }, {
      typedoctime,
      html: htmlResult,
      json: jsonResults,
    }] = await Promise.all([
      buildModules(buildOpts, assets),
      initTypedoc({
        srcDir: buildOpts.srcDir,
        bundles: assets.bundles,
        verbose: buildOpts.verbose,
      })
        .then(async ({ elapsed, result: [app, project] }) => {
          const [json, html] = await Promise.all([
            buildJsons(project, {
              outDir: buildOpts.outDir,
              bundles: assets.bundles,
            }),
            buildHtml(app, project, {
              outDir: buildOpts.outDir,
              modulesSpecified: assets.modulesSpecified,
            }),
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
