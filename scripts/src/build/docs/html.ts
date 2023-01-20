import chalk from 'chalk';
import { Command } from 'commander';
import type { Application, ProjectReflection } from 'typedoc';

import { retrieveManifest } from '../../scriptUtils';
import { divideAndRound, wrapWithTimer } from '../buildUtils';
import type { BuildResult } from '../types';

import { initTypedoc, logTypedocTime } from './docUtils';

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
export const logHtmlResult = ({ elapsed, result: { severity, error } }: { elapsed: number, result: BuildResult }) => {
  if (severity === 'success') {
    const timeStr = divideAndRound(elapsed, 1000, 2);
    console.log(`${chalk.cyanBright('HTML documentation built')} ${chalk.greenBright('successfully')} in ${timeStr}s\n`);
  } else if (severity === 'warn') {
    console.log(chalk.yellowBright('-m was specified, not building HTML documentation\n'));
  } else {
    console.log(`${chalk.cyanBright('HTML documentation')} ${chalk.redBright('failed')}: ${error}\n`);
  }
};

type HTMLCommandOpts = {
  srcDir: string;
  outDir: string;
  manifest: string;
  verbose: boolean;
};

/**
 * CLI command to only build HTML documentation
 */
const buildHtmlCommand = new Command('html')
  .option('--outDir <outdir>', 'Output directory', 'build')
  .option('--srcDir <srcdir>', 'Source directory for files', 'src')
  .option('--manifest <file>', 'Manifest file', 'modules.json')
  .option('-v, --verbose', 'Display more information about the build results', false)
  .description('Build only HTML documentation')
  .action(async (opts: HTMLCommandOpts) => {
    const manifest = await retrieveManifest(opts.manifest);

    const { elapsed: typedoctime, result: [app, project] } = await initTypedoc({
      bundles: Object.keys(manifest),
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
