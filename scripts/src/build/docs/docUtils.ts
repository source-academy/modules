import chalk from 'chalk';
import { type ProjectReflection, Application, TSConfigReader } from 'typedoc';

import { wrapWithTimer } from '../../scriptUtils.js';
import { bundleNameExpander, divideAndRound } from '../buildUtils.js';

type TypedocOpts = {
  srcDir: string;
  bundles: string[];
  verbose: boolean;
};

/**
 * Offload running typedoc into async code to increase parallelism
 *
 * @param watch Pass true to initialize typedoc in watch mode. `app.convert()` will not be called.
 */
export const initTypedoc = wrapWithTimer(
  ({
    srcDir,
    bundles,
    verbose,
  }: TypedocOpts,
  watch?: boolean) => new Promise<[Application, ProjectReflection]>((resolve, reject) => {
    try {
      const app = new Application();
      app.options.addReader(new TSConfigReader());

      app.bootstrap({
        categorizeByGroup: true,
        entryPoints: bundles.map(bundleNameExpander(srcDir)),
        excludeInternal: true,
        logger: watch ? 'none' : undefined,
        logLevel: verbose ? 'Info' : 'Error',
        name: 'Source Academy Modules',
        readme: `${srcDir}/README.md`,
        tsconfig: `${srcDir}/tsconfig.json`,
        skipErrorChecking: true,
        watch,
      });

      if (watch) resolve([app, null]);

      const project = app.convert();
      if (!project) {
        reject(new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!'));
      } else resolve([app, project]);
    } catch (error) {
      reject(error);
    }
  }),
);

export const logTypedocTime = (elapsed: number) => console.log(
  `${chalk.cyanBright('Took')} ${divideAndRound(elapsed, 1000)}s ${chalk.cyanBright('to initialize typedoc')}`,
);
