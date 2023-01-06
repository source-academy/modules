import chalk from 'chalk';
import { Command } from 'commander';

import { type BuildOptions, retrieveManifest } from '../scriptUtils';

import { divideAndRound } from './buildUtils';
import buildDocsCommand, { buildDocs, initTypedoc, logHtmlResult, logJsonResults } from './docs';
import buildModulesCommand, { buildModules, buildTabCommand, logBundleResults, logTabResults } from './modules';

const buildAllCommand = async (buildOpts: BuildOptions) => {
  const bundlesToBuild = buildOpts.modules;
  console.log(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n${
    bundlesToBuild.map((bundle, i) => `${i + 1}. ${bundle}`)
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
        const docsResults = await buildDocs(buildOpts, app, project);
        return {
          typedoctime: elapsed,
          ...docsResults,
        };
      }),
  ]);

  console.log(`${chalk.cyanBright('Took')} ${divideAndRound(typedoctime, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}\n`);

  logBundleResults(bundleResults);
  logTabResults(tabResults);
  logJsonResults(jsonResults);
  logHtmlResult(htmlResult);
};

export default new Command('build')
  .argument('[subcommand]', 'Build subcommands: "all, modules, docs"', 'all')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--outDir <outdir>', 'Output directory', 'build')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-m, --modules <...modules>', 'Manually specify which modules to build', [])
  .action(async (subcommand: string, rawOpts: Omit<BuildOptions, 'modules'> & { modules: string | string[] }) => {
    const manifest = await retrieveManifest(rawOpts.manifest);
    if (typeof rawOpts.modules === 'string') {
      rawOpts.modules = rawOpts.modules.split(' ');
    }

    if (rawOpts.modules.length === 0) {
      rawOpts.modules = Object.keys(manifest);
      rawOpts.modulesSpecified = false;
    } else {
      const undefineds = rawOpts.modules.filter((module) => !rawOpts.modules.includes(module));
      if (undefineds.length > 0) {
        console.log(chalk.redBright(`Unknown modules: ${undefineds.join(', ')}`));
        return;
      }

      rawOpts.modulesSpecified = true;
    }
    const buildOpts = {
      ...rawOpts,
      tabs: Object.values(manifest)
        .flatMap((x) => x.tabs),
      modules: rawOpts.modules as string[],
    };

    const subfunc = {
      all: buildAllCommand,
      docs: buildDocsCommand,
      modules: buildModulesCommand,
      tabs: buildTabCommand,
    }[subcommand];
    if (!subcommand) console.log(chalk.redBright(`Unknown build command: "${subcommand}"`));
    else await subfunc(buildOpts);
  });

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
