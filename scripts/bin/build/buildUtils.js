import chalk from 'chalk';
import { Command, Option } from 'commander';
import { Table } from 'console-table-printer';
import path from 'path';
import { retrieveManifest } from '../scriptUtils.js';
export const divideAndRound = (dividend, divisor, round = 2) => (dividend / divisor).toFixed(round);
export const fileSizeFormatter = (size) => {
    if (typeof size !== 'number')
        return '-';
    size /= 1000;
    if (size < 0.01)
        return '<0.01 KB';
    if (size >= 100)
        return `${divideAndRound(size, 1000)} MB`;
    return `${size.toFixed(2)} KB`;
};
export const logResult = (unreduced, verbose) => {
    const overallResult = unreduced.reduce((res, [type, name, entry]) => {
        if (!res[type]) {
            res[type] = {
                severity: 'success',
                results: {},
            };
        }
        if (entry.severity === 'error')
            res[type].severity = 'error';
        else if (res[type].severity === 'success' && entry.severity === 'warn')
            res[type].severity = 'warn';
        res[type].results[name] = entry;
        return res;
    }, {});
    return console.log(Object.entries(overallResult)
        .map(([label, toLog]) => {
        if (!toLog)
            return null;
        const upperCaseLabel = label[0].toUpperCase() + label.slice(1);
        const { severity: overallSev, results } = toLog;
        const entries = Object.entries(results);
        if (entries.length === 0)
            return '';
        if (!verbose) {
            if (overallSev === 'success') {
                return `${chalk.cyanBright(`${upperCaseLabel}s built`)} ${chalk.greenBright('successfully')}\n`;
            }
            if (overallSev === 'warn') {
                return chalk.cyanBright(`${upperCaseLabel}s built with ${chalk.yellowBright('warnings')}:\n${entries
                    .filter(([, { severity }]) => severity === 'warn')
                    .map(([bundle, { error }], i) => chalk.yellowBright(`${i + 1}. ${bundle}: ${error}`))
                    .join('\n')}\n`);
            }
            return chalk.cyanBright(`${upperCaseLabel}s build ${chalk.redBright('failed')} with errors:\n${entries
                .filter(([, { severity }]) => severity !== 'success')
                .map(([bundle, { error, severity }], i) => (severity === 'error'
                ? chalk.redBright(`${i + 1}. Error ${bundle}: ${error}`)
                : chalk.yellowBright(`${i + 1}. Warning ${bundle}: +${error}`)))
                .join('\n')}\n`);
        }
        const outputTable = new Table({
            columns: [{
                    name: 'name',
                    title: upperCaseLabel,
                },
                {
                    name: 'severity',
                    title: 'Status',
                },
                {
                    name: 'elapsed',
                    title: 'Elapsed (s)',
                },
                {
                    name: 'fileSize',
                    title: 'File Size',
                },
                {
                    name: 'error',
                    title: 'Errors',
                }],
        });
        entries.forEach(([name, { elapsed, severity, error, fileSize }]) => {
            if (severity === 'error') {
                outputTable.addRow({
                    name,
                    elapsed: '-',
                    error,
                    fileSize: '-',
                    severity: 'Error',
                }, { color: 'red' });
            }
            else if (severity === 'warn') {
                outputTable.addRow({
                    name,
                    elapsed: divideAndRound(elapsed, 1000, 2),
                    error,
                    fileSize: fileSizeFormatter(fileSize),
                    severity: 'Warning',
                }, { color: 'yellow' });
            }
            else {
                outputTable.addRow({
                    name,
                    elapsed: divideAndRound(elapsed, 1000, 2),
                    error: '-',
                    fileSize: fileSizeFormatter(fileSize),
                    severity: 'Success',
                }, { color: 'green' });
            }
        });
        if (overallSev === 'success') {
            return `${chalk.cyanBright(`${upperCaseLabel}s built`)} ${chalk.greenBright('successfully')}:\n${outputTable.render()}\n`;
        }
        if (overallSev === 'warn') {
            return `${chalk.cyanBright(`${upperCaseLabel}s built`)} with ${chalk.yellowBright('warnings')}:\n${outputTable.render()}\n`;
        }
        return `${chalk.cyanBright(`${upperCaseLabel}s build ${chalk.redBright('failed')} with errors`)}:\n${outputTable.render()}\n`;
    })
        .filter((str) => str !== null)
        .join('\n'));
};
/**
 * Function to determine which bundles and tabs to build based on the user's input.
 *
 * @param modules
 * - Pass `null` to indicate that the user did not specify any modules. This
 *   will add all bundles currently registered in the manifest
 * - Pass `[]` to indicate not to add any modules
 * - Pass an array of strings to manually specify modules to process
 * @param tabOpts
 * - Pass `null` to indicate that the user did not specify any tabs. This
 *   will add all tabs currently registered in the manifest
 * - Pass `[]` to indicate not to add any tabs
 * - Pass an array of strings to manually specify tabs to process
 * @param addTabs If `true`, then all tabs of selected bundles will be added to
 * the list of tabs to build.
 */
export const retrieveBundlesAndTabs = async (manifestFile, modules, tabOpts, addTabs = true) => {
    const manifest = await retrieveManifest(manifestFile);
    const knownBundles = Object.keys(manifest);
    const knownTabs = Object.values(manifest)
        .flatMap((x) => x.tabs);
    let bundles;
    let tabs;
    if (modules !== null) {
        // Some modules were specified
        const unknownModules = modules.filter((m) => !knownBundles.includes(m));
        if (unknownModules.length > 0) {
            throw new Error(`Unknown modules: ${unknownModules.join(', ')}`);
        }
        bundles = modules;
        if (addTabs) {
            // If a bundle is being rebuilt, add its tabs
            tabs = modules.flatMap((bundle) => manifest[bundle].tabs);
        }
        else {
            tabs = [];
        }
    }
    else {
        // No modules were specified
        bundles = knownBundles;
        tabs = [];
    }
    if (tabOpts !== null) {
        // Tabs were specified
        const unknownTabs = tabOpts.filter((t) => !knownTabs.includes(t));
        if (unknownTabs.length > 0) {
            throw new Error(`Unknown tabs: ${unknownTabs.join(', ')}`);
        }
        tabs = tabs.concat(tabOpts);
    }
    else {
        // No tabs were specified
        tabs = tabs.concat(knownTabs);
    }
    return {
        bundles: [...new Set(bundles)],
        tabs: [...new Set(tabs)],
        modulesSpecified: modules !== null,
    };
};
export const bundleNameExpander = (srcdir) => (name) => path.join(srcdir, 'bundles', name, 'index.ts');
export const tabNameExpander = (srcdir) => (name) => path.join(srcdir, 'tabs', name, 'index.tsx');
export const createBuildCommand = (label, addLint) => {
    const cmd = new Command(label)
        .option('--outDir <outdir>', 'Output directory', 'build')
        .option('--srcDir <srcdir>', 'Source directory for files', 'src')
        .option('--manifest <file>', 'Manifest file', 'modules.json')
        .option('-v, --verbose', 'Display more information about the build results', false);
    if (addLint) {
        cmd.option('--no-tsc', 'Don\'t run tsc before building')
            .option('--fix', 'Ask eslint to autofix linting errors', false)
            .addOption(new Option('--no-lint', 'Don\'t run eslint before building')
            .conflicts('fix'));
    }
    return cmd;
};
