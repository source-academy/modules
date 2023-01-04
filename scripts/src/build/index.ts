import chalk from 'chalk';

import { type BuildOptions, retrieveManifest } from '../scriptUtils';

import { divideAndRound } from './buildUtils';
import { buildDocs, initTypedoc, logHtmlResult, logJsonResults } from './docs';
import { buildModules, logBundleResults, logTabResults } from './modules';

export const buildAll = async (buildOpts: BuildOptions) => {
  const manifest = await retrieveManifest(buildOpts);
  const bundlesToBuild = Object.keys(manifest);

  console.log(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n${
    bundlesToBuild.map((bundle, i) => `${i + 1}. ${bundle}`)
      .join('\n')
  }\n`);

  const [{ bundles: bundleResults, tabs: tabResults }, {
    typedoctime,
    html: htmlResult,
    json: jsonResults,
  }] = await Promise.all([
    buildModules(buildOpts, manifest),
    initTypedoc(bundlesToBuild, buildOpts)
      .then(async ({ elapsed, result: [app, project] }) => {
        const docsResults = await buildDocs(buildOpts, app, project, bundlesToBuild);
        return {
          typedoctime: elapsed,
          ...docsResults,
        };
      }),
  ]);

  console.log(`${chalk.cyanBright('Took')} ${divideAndRound(typedoctime, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}`);

  logBundleResults(bundleResults);
  logTabResults(tabResults);
  logJsonResults(jsonResults);
  logHtmlResult(htmlResult);
};

export { default as buildModules } from './modules';
export { default as buildDocs } from './docs';

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
