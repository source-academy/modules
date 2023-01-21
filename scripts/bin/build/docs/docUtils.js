import chalk from 'chalk';
import { Application, TSConfigReader } from 'typedoc';
import { divideAndRound, wrapWithTimer } from '../buildUtils.js';
/**
 * Offload running typedoc into async code to increase parallelism
 */
export const initTypedoc = wrapWithTimer(({ srcDir, bundles, verbose, }, watch) => new Promise((resolve, reject) => {
    try {
        const app = new Application();
        app.options.addReader(new TSConfigReader());
        app.bootstrap({
            categorizeByGroup: true,
            entryPoints: bundles.map((bundle) => `${srcDir}/bundles/${bundle}/index.ts`),
            excludeInternal: true,
            logger: watch ? 'none' : undefined,
            logLevel: verbose ? 'Info' : 'Error',
            name: 'Source Academy Modules',
            readme: `${srcDir}/README.md`,
            tsconfig: `${srcDir}/tsconfig.json`,
            skipErrorChecking: true,
            watch,
        });
        const project = app.convert();
        if (!project) {
            reject(new Error('Failed to initialize typedoc - Make sure to check that the source files have no compilation errors!'));
        }
        else
            resolve([app, project]);
    }
    catch (error) {
        reject(error);
    }
}));
export const logTypedocTime = (elapsed) => console.log(`${chalk.cyanBright('Took')} ${divideAndRound(elapsed, 1000, 2)}s ${chalk.cyanBright('to initialize typedoc')}`);
