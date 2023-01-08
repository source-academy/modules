import chalk from 'chalk';
import { type ProjectReflection, Application, TSConfigReader } from 'typedoc';

import { type BuildOptions, divideAndRound, wrapWithTimer } from '../buildUtils';

/**
 * Offload running typedoc into async code to increase parallelism
 */
export const initTypedoc = wrapWithTimer(({ srcDir, bundles }: BuildOptions) => new Promise<[Application, ProjectReflection]>((resolve, reject) => {
  try {
    const app = new Application();
    app.options.addReader(new TSConfigReader());

    app.bootstrap({
      categorizeByGroup: true,
      entryPoints: bundles.map((bundle) => `${srcDir}/bundles/${bundle}/index.ts`),
      excludeInternal: true,
      logger: 'none',
      name: 'Source Academy Modules',
      readme: `${srcDir}/README.md`,
      tsconfig: `${srcDir}/tsconfig.json`,
      skipErrorChecking: true,
    });
    const project = app.convert();
    if (!project) reject(new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!'));
    else resolve([app, project]);
  } catch (error) {
    reject(error);
  }
}));

export const logTypedocTime = (elapsed: number) => console.log(`${chalk.cyanBright('Took')} ${divideAndRound(elapsed, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}`);
