import chalk from 'chalk';
import fs from 'fs/promises';

import { type BuildOptions, retrieveManifest } from '../scriptUtils';

import { initTypedoc } from './docs/docUtils';
import buildHtml, { logHtmlResult } from './docs/html';
import { logJsonResults } from './docs/json';
import { buildBundles, logBundleResults, watchBundles } from './modules/bundle';
import { buildTabs, logTabResults, watchTabs } from './modules/tab';
import { divideAndRound } from './buildUtils';

export const buildAll = async (buildOpts: BuildOptions) => {
  console.log(buildOpts);

  const manifest = await retrieveManifest(buildOpts);
  const bundlesToBuild = Object.keys(manifest);
  const tabs = Object.values(manifest)
    .flatMap((module) => module.tabs);

  console.log(`${chalk.cyanBright('Building bundles, tabs, jsons and HTML for the following bundles:')}\n${
    bundlesToBuild.map((bundle, i) => `${i + 1}. ${bundle}`)
      .join('\n')
  }`);

  const typedocWrapper = async () => {
    // Helper to initialize typedoc in parallel
    const { elapsed: typedocTime, result: [app, project] } = await initTypedoc(bundlesToBuild, buildOpts);
    const [{ elapsed: bundleTime, result: { bundles, jsons } }, htmlResult] = await Promise.all([buildBundles(buildOpts, project, bundlesToBuild), buildHtml(app, project, buildOpts)]);
    return {
      typedocTime,
      bundleTime,
      bundles,
      jsons,
      htmlResult,
    };
  };

  const [
    {
      typedocTime,
      bundleTime,
      bundles: bundleResults,
      jsons: jsonResults,
      htmlResult,
    },
    {
      elapsed: tabTime,
      result: tabResults,
    },
  ] = await Promise.all([
    typedocWrapper(),
    buildTabs(buildOpts, tabs),
    fs.copyFile(buildOpts.manifest, `${buildOpts.outDir}/${buildOpts.manifest}`),
  ]);

  console.log(chalk.cyanBright(`Took ${divideAndRound(typedocTime, 1000, 2)}s to initialize typedoc`));
  logBundleResults(bundleTime, bundleResults);
  logTabResults(tabTime, tabResults);
  logJsonResults(jsonResults);
  logHtmlResult(htmlResult);
};

export const watchAll = async (buildOpts: BuildOptions) => {
  const manifest = await retrieveManifest(buildOpts);
  const bundlesToBuild = Object.keys(manifest);
  const tabs = Object.values(manifest)
    .flatMap((module) => module.tabs);

  console.log(chalk.magentaBright('Beginning watch'));
  await Promise.all([
    initTypedoc(bundlesToBuild, buildOpts)
      .then(({ elapsed, result: [, project] }) => {
        console.log(chalk.cyanBright(`Took ${divideAndRound(elapsed, 1000, 2)}s to initialize typedoc`));
        return watchBundles(buildOpts, project, bundlesToBuild);
      }),
    watchTabs(buildOpts, tabs),
  ]);
};
