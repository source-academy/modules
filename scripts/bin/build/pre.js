import chalk from 'chalk';
import { ESLint } from 'eslint';
import pathlib from 'path';
import { createBuildCommand } from './buildUtils.js';
/**
 * Run eslint programmatically
 * Refer to https://eslint.org/docs/latest/integrate/nodejs-api for documentation
 */
const runEslint = async ({ bundles, tabs, fix, ...opts }) => {
    const linter = new ESLint({
        cwd: pathlib.resolve(opts.srcDir),
        overrideConfigFile: '.eslintrc.cjs',
        extensions: ['ts', 'tsx'],
        fix,
        useEslintrc: false,
    });
    const promises = [
        bundles.length > 0 ? linter.lintFiles(bundles.map((bundle) => pathlib.join('bundles', bundle))) : Promise.resolve([]),
        tabs.length > 0 ? linter.lintFiles(tabs.map((tabName) => pathlib.join('tabs', tabName))) : Promise.resolve([]),
    ];
    const [lintBundles, lintTabs] = await Promise.all(promises);
    console.log(`${chalk.magentaBright('Running eslint for the following bundles:')}:\n${bundles.map((bundle, i) => `${i + 1}: ${bundle}`)
        .join('\n')}`);
    const lintResults = [...lintBundles, ...lintTabs];
    if (fix) {
        await ESLint.outputFixes(lintResults);
    }
    const outputFormatter = await linter.loadFormatter('stylish');
    const resultText = outputFormatter.format(lintResults);
    console.log(resultText);
};
export const lintCommand = createBuildCommand('lint', (opts) => runEslint(opts))
    .option('--fix', 'Ask eslint to auto fix linting errors', false);
