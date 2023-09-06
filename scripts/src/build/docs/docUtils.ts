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
  async ({
    srcDir,
    bundles,
    verbose,
  }: TypedocOpts,
  watch?: boolean): Promise<[Application, ProjectReflection | null]> => {
    // const app = new Application();

    const app = await Application.bootstrap({
      categorizeByGroup: true,
      entryPoints: bundles.map(bundleNameExpander(srcDir)),
      excludeInternal: true,
      // logger: watch ? 'none' : undefined,
      logLevel: verbose ? 'Info' : 'Error',
      name: 'Source Academy Modules',
      readme: `${srcDir}/README.md`,
      tsconfig: `${srcDir}/tsconfig.json`,
      skipErrorChecking: true,
      watch,
    });

    app.options.addReader(new TSConfigReader());

    if (watch) return [app, null];

    const project = await app.convert();
    if (!project) {
      throw new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!');
    } else return [app, project];
  },
);

export const logTypedocTime = (elapsed: number) => console.log(
  `${chalk.cyanBright('Took')} ${divideAndRound(elapsed, 1000)}s ${chalk.cyanBright('to initialize typedoc')}`,
);
