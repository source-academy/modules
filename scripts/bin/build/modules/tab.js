import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { Command, Option } from 'commander';
import { promises as fs } from 'fs';
import { printList } from '../../scriptUtils.js';
import { createBuildLogger, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logLintResult } from '../prebuild/eslint.js';
import { preBuild } from '../prebuild/index.js';
import { logTscResults } from '../prebuild/tsc.js';
import { buildModules } from './index.js';
import { requireCreator } from './moduleUtils.js';
/**
 * Imports that are provided at runtime
 */
const externals = {
    'react': '_react',
    'react-dom': 'ReactDOM',
};
export const outputTab = async (tabName, text, outDir) => {
    try {
        const parsed = parse(text, { ecmaVersion: 6 });
        const declStatement = parsed.body[1];
        const newTab = {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                params: Object.values(externals)
                    .map((name) => ({
                    type: 'Identifier',
                    name,
                })),
                body: {
                    type: 'BlockStatement',
                    body: [
                        requireCreator(externals),
                        {
                            type: 'ReturnStatement',
                            argument: {
                                type: 'MemberExpression',
                                object: declStatement.declarations[0].init,
                                property: {
                                    type: 'Literal',
                                    value: 'default',
                                },
                                computed: true,
                            },
                        },
                    ],
                },
            },
        };
        let newCode = generate(newTab);
        if (newCode.endsWith(';'))
            newCode = newCode.slice(0, -1);
        const outFile = `${outDir}/tabs/${tabName}.js`;
        await fs.writeFile(outFile, newCode);
        const { size } = await fs.stat(outFile);
        return {
            severity: 'success',
            fileSize: size,
        };
    }
    catch (error) {
        return {
            severity: 'error',
            error,
        };
    }
};
export const logTabResults = createBuildLogger('tab');
const buildTabsCommand = new Command('tabs')
    .option('--fix', 'Ask eslint to autofix linting errors', false)
    .option('--outDir <outdir>', 'Output directory', 'build')
    .option('--srcDir <srcdir>', 'Source directory for files', 'src')
    .option('--manifest <file>', 'Manifest file', 'modules.json')
    .option('--no-tsc', 'Don\'t run tsc before building')
    .addOption(new Option('--no-lint', 'Don\'t run eslint before building')
    .conflicts('fix'))
    .argument('[tabs...]', 'Manually specify which tabs to build', null)
    .description('Build only tabs')
    .action(async (tabs, { manifest, ...opts }) => {
    const [assets] = await Promise.all([
        retrieveBundlesAndTabs(manifest, [], tabs),
        fs.mkdir(`${opts.outDir}/tabs`, { recursive: true }),
    ]);
    const { tscResult, lintResult, proceed } = await preBuild(opts, assets);
    logLintResult(lintResult);
    logTscResults(tscResult, opts.srcDir);
    if (!proceed)
        return;
    printList(`${chalk.magentaBright('Building the following tabs:')}\n`, assets.tabs);
    const { tabs: tabResult } = await buildModules(opts, assets);
    logTabResults(tabResult, opts.verbose);
});
export default buildTabsCommand;
