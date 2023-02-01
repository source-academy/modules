import chalk from 'chalk';
import { Command } from 'commander';
import type { Application, ProjectReflection } from 'typedoc';

import { wrapWithTimer } from '../../scriptUtils.js';
import { divideAndRound, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logTscResults, runTsc } from '../prebuild/tsc.js';
import type { BuildCommandInputs, BuildResult } from '../types';

import { initTypedoc, logTypedocTime } from './docUtils.js';

type HTMLOptions = {
  outDir: string;
  modulesSpecified: boolean;
};

/**
 * Build HTML documentation
 */
export const buildHtml = wrapWithTimer(async (app: Application,
  project: ProjectReflection, {
    outDir,
    modulesSpecified,
  }: HTMLOptions): Promise<BuildResult> => {
  if (modulesSpecified) {
    return {
      severity: 'warn',
    };
  }

  try {
    await app.generateDocs(project, `${outDir}/documentation`);
    return {
      severity: 'success',
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
    };
  }
});

/**
 * Log output from `buildHtml`
 * @see {buildHtml}
 */
export const logHtmlResult = (htmlResult: Awaited<ReturnType<typeof buildHtml>> | null) => {
  if (!htmlResult) return;

  const { elapsed, result: { severity, error } } = htmlResult;
  if (severity === 'success') {
    const timeStr = divideAndRound(elapsed, 1000);
    console.log(`${chalk.cyanBright('HTML documentation built')} ${chalk.greenBright('successfully')} in ${timeStr}s\n`);
  } else if (severity === 'warn') {
    console.log(chalk.yellowBright('Modules were manually specified, not building HTML documentation\n'));
  } else {
    console.log(`${chalk.cyanBright('HTML documentation')} ${chalk.redBright('failed')}: ${error}\n`);
  }
};

type HTMLCommandInputs = Omit<BuildCommandInputs, 'modules' | 'tabs'>;

/**
 * CLI command to only build HTML documentation
 */
const buildHtmlCommand = new Command('html')
  .option('--outDir <outdir>', 'Output directory', 'build')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-v, --verbose', 'Display more information about the build results', false)
  .option('--no-tsc', 'Don\'t run tsc before building')
  .description('Build only HTML documentation')
  .action(async (opts: HTMLCommandInputs) => {
    const assets = await retrieveBundlesAndTabs(opts.manifest, null, null);

    if (opts.tsc) {
      const tscResult = await runTsc(opts.srcDir, assets);
      logTscResults(tscResult, opts.srcDir);
      if (tscResult.result.severity === 'error') return;
    }

    const { elapsed: typedoctime, result: [app, project] } = await initTypedoc({
      bundles: assets.bundles,
      srcDir: opts.srcDir,
      verbose: opts.verbose,
    });
    logTypedocTime(typedoctime);

    const htmlResult = await buildHtml(app, project, {
      outDir: opts.outDir,
      modulesSpecified: false,
    });
    logHtmlResult(htmlResult);
  });

export default buildHtmlCommand;
