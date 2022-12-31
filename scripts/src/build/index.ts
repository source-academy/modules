import chalk from 'chalk';
import { Command } from 'commander';

import { type BuildOptions, getDefaultOptions, retrieveManifest } from '../scriptUtils';

import { initTypedoc } from './docs/docUtils';
import buildHtml from './docs/html';
import buildBundles from './modules/bundle';
import buildTabs from './modules/tab';
import { divideAndRound } from './buildUtils';

const buildAll = async (buildOpts: BuildOptions) => {
  const manifest = await retrieveManifest(buildOpts);
  const bundlesToBuild = Object.keys(manifest);
  const tabs = Object.values(manifest)
    .flatMap((module) => module.tabs);

  console.log(chalk.cyanBright('Building bundles, tabs, jsons and HTML'));
  console.log(`${chalk.cyanBright('Bundles to build:')}\n${
    bundlesToBuild.map((bundle, i) => `${i + 1}. ${bundle}`)
      .join('\n')
  }`);
  const app = initTypedoc(bundlesToBuild, buildOpts);
  const project = app.convert();

  if (!project) throw new Error('Failed to init typedoc');

  const [{
    elapsed: bundleTime,
    result: {
      bundles: [bundleSeverity, bundleTable],
      jsons: [jsonSeverity, jsonTable],
    },
  },
  {
    elapsed: tabTime,
    result: [tabSeverity, tabTable],
  },
  htmlResult] = await Promise.all([
    buildBundles(buildOpts, project, bundlesToBuild),
    buildTabs(buildOpts, tabs),
    buildHtml(app, project, buildOpts),
  ]);

  const bundleTimeStr = `${divideAndRound(bundleTime, 1000, 2)}s`;
  if (bundleSeverity === 'success') {
    console.log(`${chalk.cyanBright('Bundles built')} ${chalk.greenBright('successfully')}:\n${bundleTable.render()} in ${bundleTimeStr}`);
  } else {
    console.log(`${chalk.cyanBright('Bundles failed with')} ${chalk.redBright('errors')}:\n${bundleTable.render()} in ${bundleTimeStr}`);
  }

  const tabTimeStr = `${divideAndRound(tabTime, 1000, 2)}s`;
  if (tabSeverity === 'success') {
    console.log(`${chalk.cyanBright('Tabs built')} ${chalk.greenBright('successfully')}:\n${tabTable.render()} in ${tabTimeStr}`);
  } else {
    console.log(`${chalk.cyanBright('Tabs failed with')} ${chalk.redBright('errors')}:\n${tabTable.render()} in ${tabTimeStr}`);
  }

  if (jsonSeverity === 'success') {
    console.log(`${chalk.cyanBright('JSONS built')} ${chalk.greenBright('successfully')}:\n${jsonTable.render()}`);
  } else if (jsonSeverity === 'warn') {
    console.log(`${chalk.cyanBright('JSONS built with')} ${chalk.yellowBright('warnings')}:\n${jsonTable.render()}`);
  } else {
    console.log(`${chalk.cyanBright('JSONS failed with')} ${chalk.redBright('errors')}:\n${jsonTable.render()}`);
  }

  if (htmlResult.result.severity === 'success') {
    const timeStr = divideAndRound(htmlResult.elapsed, 1000, 2);
    console.log(`${chalk.cyanBright('HTML documentation built')} ${chalk.greenBright('successfully')} in ${timeStr}s`);
  } else {
    console.log(`${chalk.cyanBright('HTML documentation')} ${chalk.redBright('failed')}: ${htmlResult.result.error}`);
  }
};

export default new Command('build')
  .action(async (opts: Partial<BuildOptions>) => {
    const fullOpts = getDefaultOptions(opts);
    await buildAll(fullOpts);
  });
