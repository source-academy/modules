import chalk from 'chalk';
import { Command } from 'commander';
import { ESLint } from 'eslint';
import pathlib from 'path';
import { printList, wrapWithTimer } from '../../scriptUtils.js';
import { divideAndRound, retrieveBundlesAndTabs } from '../buildUtils.js';
/**
 * Run eslint programmatically
 * Refer to https://eslint.org/docs/latest/integrate/nodejs-api for documentation
 */
export const runEslint = wrapWithTimer(async (opts, { bundles, tabs }) => {
    const linter = new ESLint({
        cwd: pathlib.resolve(opts.srcDir),
        overrideConfigFile: '.eslintrc.cjs',
        extensions: ['ts', 'tsx'],
        fix: opts.fix,
        useEslintrc: false,
    });
    const promises = [
        bundles.length > 0 ? linter.lintFiles(bundles.map((bundle) => pathlib.join('bundles', bundle))) : Promise.resolve([]),
        tabs.length > 0 ? linter.lintFiles(tabs.map((tabName) => pathlib.join('tabs', tabName))) : Promise.resolve([]),
    ];
    if (bundles.length > 0) {
        printList(`${chalk.magentaBright('Running eslint on the following bundles')}:\n`, bundles);
    }
    if (tabs.length > 0) {
        printList(`${chalk.magentaBright('Running eslint on the following tabs')}:\n`, tabs);
    }
    const [lintBundles, lintTabs] = await Promise.all(promises);
    const lintResults = [...lintBundles, ...lintTabs];
    if (opts.fix) {
        console.log(chalk.magentaBright('Running eslint autofix...'));
        await ESLint.outputFixes(lintResults);
    }
    const lintSeverity = lintResults.reduce((res, { errorCount, warningCount }) => {
        if (errorCount > 0 || res === 'error')
            return 'error';
        if (warningCount > 0)
            return 'warn';
        return res;
    }, 'success');
    const outputFormatter = await linter.loadFormatter('stylish');
    const formatterOutput = outputFormatter.format(lintResults);
    return {
        formatted: typeof formatterOutput === 'string' ? formatterOutput : await formatterOutput,
        results: lintResults,
        severity: lintSeverity,
    };
});
export const logLintResult = (input) => {
    if (!input)
        return;
    const { elapsed, result: { formatted, severity } } = input;
    let errStr;
    if (severity === 'error')
        errStr = chalk.cyanBright('with ') + chalk.redBright('errors');
    else if (severity === 'warn')
        errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings');
    else
        errStr = chalk.greenBright('successfully');
    console.log(`${chalk.cyanBright(`Linting completed in ${divideAndRound(elapsed, 1000)}s ${errStr}:`)}\n${formatted}`);
};
export const lintCommand = new Command('lint')
    .description('Run eslint')
    .option('--fix', 'Ask eslint to autofix linting errors', false)
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('-m, --modules <modules...>', 'Manually specify which modules to check', null)
    .option('-t, --tabs <tabs...>', 'Manually specify which tabs to check', null)
    .option('-v, --verbose', 'Display more information about the build results', false)
    .action(async ({ modules, tabs, manifest, ...opts }) => {
    const assets = await retrieveBundlesAndTabs(manifest, modules, tabs);
    const result = await runEslint(opts, assets);
    logLintResult(result);
});
