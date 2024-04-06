import { Command } from '@commander-js/extra-typings';
import chalk from 'chalk';
import { manifestOption, outDirOption, retrieveBundlesAndTabs, srcDirOption, wrapWithTimer, type BuildInputs } from '@src/commandUtils';
import type { AwaitedReturn } from '../utils';
import { initTypedoc, type TypedocResult } from './docsUtils';

export type HtmlResult = {
  severity: 'error' | 'warn'
  error: any
} | {
  severity: 'success'
};

export const buildHtml = wrapWithTimer(async (
  inputs: Omit<BuildInputs, 'tabs'>,
  outDir: string,
  [project, app]: TypedocResult
): Promise<HtmlResult> => {
  if (inputs.modulesSpecified) {
    return {
      severity: 'warn',
      error: 'Not all modules were built, skipping building HTML documentation'
    };
  }

  try {
    await app.generateDocs(project, `${outDir}/documentation`);
    return {
      severity: 'success'
    };
  } catch (error) {
    return {
      severity: 'error',
      error
    };
  }
});

export function htmlLogger({ result, elapsed }: AwaitedReturn<typeof buildHtml>) {
  const timeStr = `${(elapsed / 1000).toFixed(2)}s`;
  switch (result.severity) {
    case 'success':
      return `${chalk.cyanBright('Built HTML documentation')} ${chalk.greenBright('successfully')} in ${timeStr}`;
    case 'warn':
      return chalk.yellowBright(result.error);
    case 'error':
      return `${chalk.redBright('Failed')} ${chalk.cyanBright('to build HTML documentation: ')} ${result.error}`;
  }
}

export const getBuildHtmlCommand = () => new Command('html')
  .addOption(srcDirOption)
  .addOption(outDirOption)
  .addOption(manifestOption)
  .option('-v, --verbose')
  .action(async opts => {
    const inputs = await retrieveBundlesAndTabs(opts.manifest, null, [], false);
    const tdResult = await initTypedoc(inputs.bundles, opts.srcDir, opts.verbose, false);
    const result = await buildHtml(inputs, opts.outDir, tdResult);
    console.log(htmlLogger(result));

    if (result.result.severity === 'error') process.exit(1);
  });
