import chalk from 'chalk';
import type { Application, ProjectReflection } from 'typedoc';

import type { BuildOptions } from '../../scriptUtils';
import { divideAndRound, wrapWithTimer } from '../buildUtils';
import type { BuildResult } from '../types';

export default wrapWithTimer(async (app: Application, project: ProjectReflection, buildOpts: BuildOptions): Promise<BuildResult> => {
  try {
    await app.generateDocs(project, `${buildOpts.outDir}/documentation`);
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

export const logHtmlResult = ({ elapsed, result: { severity, error } }: { elapsed: number, result: BuildResult }) => {
  if (severity === 'success') {
    const timeStr = divideAndRound(elapsed, 1000, 2);
    console.log(`${chalk.cyanBright('HTML documentation built')} ${chalk.greenBright('successfully')} in ${timeStr}s`);
  } else {
    console.log(`${chalk.cyanBright('HTML documentation')} ${chalk.redBright('failed')}: ${error}`);
  }
};
