import { Command } from 'commander';
import { exitOnError, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logLintResult, runEslint } from './eslint.js';
import { logTscResults, runTsc } from './tsc.js';
/**
 * Run both `tsc` and `eslint` in parallel if `--fix` was not specified. Otherwise, run eslint
 * to fix linting errors first, then run tsc for type checking
 *
 * @returns An object that contains the results from linting and typechecking
 */
const prebuildInternal = async (opts, assets) => {
    if (opts.fix) {
        // Run tsc and then lint
        const lintResult = await runEslint(opts, assets);
        if (!opts.tsc || lintResult.result.severity === 'error') {
            return {
                lintResult,
                tscResult: null,
            };
        }
        const tscResult = await runTsc(opts.srcDir, assets);
        return {
            lintResult,
            tscResult,
        };
        // eslint-disable-next-line no-else-return
    }
    else {
        const [lintResult, tscResult] = await Promise.all([
            opts.lint ? runEslint(opts, assets) : Promise.resolve(null),
            opts.tsc ? runTsc(opts.srcDir, assets) : Promise.resolve(null),
        ]);
        return {
            lintResult,
            tscResult,
        };
    }
};
/**
 * Run eslint and tsc based on the provided options, and exit with code 1
 * if either returns with an error status
 */
export const prebuild = async (opts, assets) => {
    const { lintResult, tscResult } = await prebuildInternal(opts, assets);
    logLintResult(lintResult);
    logTscResults(tscResult, opts.srcDir);
    exitOnError([], lintResult?.result, tscResult?.result);
    if (lintResult?.result.severity === 'error' || tscResult?.result.severity === 'error') {
        throw new Error('Exiting for jest');
    }
};
const getPrebuildCommand = () => new Command('prebuild')
    .description('Run both tsc and eslint')
    .option('--fix', 'Ask eslint to autofix linting errors', false)
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('-m, --modules [modules...]', 'Manually specify which modules to check', null)
    .option('-t, --tabs [tabs...]', 'Manually specify which tabs to check', null)
    .action(async ({ modules, tabs, manifest, ...opts }) => {
    const assets = await retrieveBundlesAndTabs(manifest, modules, tabs, false);
    await prebuild({
        ...opts,
        tsc: true,
        lint: true,
    }, assets);
});
export default getPrebuildCommand;
export { default as getLintCommand } from './eslint.js';
export { default as getTscCommand } from './tsc.js';
