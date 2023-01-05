import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { Table } from 'console-table-printer';
import { promises as fs } from 'fs';
import { divideAndRound, fileSizeFormatter } from '../buildUtils';
import { requireCreator } from './moduleUtils';
import { buildModules } from '.';
export const outputTab = async (tabName, text, buildOpts) => {
    try {
        const parsed = parse(text, { ecmaVersion: 6 });
        const declStatement = parsed.body[1];
        const newTab = {
            type: 'ExpressionStatement',
            expression: {
                type: 'FunctionExpression',
                params: [
                    {
                        type: 'Identifier',
                        name: '_react',
                    },
                    {
                        type: 'Identifier',
                        name: 'ReactDOM',
                    },
                ],
                body: {
                    type: 'BlockStatement',
                    body: [
                        requireCreator({
                            'react': '_react',
                            'react-dom': 'ReactDOM',
                        }),
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
        const outFile = `${buildOpts.outDir}/tabs/${tabName}.js`;
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
export const logTabResults = (tabResults) => {
    if (typeof tabResults === 'boolean')
        return;
    const { elapsed: tabTime, severity: tabSeverity, results } = tabResults;
    const entries = Object.entries(results);
    if (entries.length === 0)
        return;
    const tabTable = new Table({
        columns: [
            {
                name: 'tab',
                title: 'Tab',
            },
            {
                name: 'severity',
                title: 'Status',
            },
            {
                name: 'elapsed',
                title: 'Build Time (s)',
            },
            {
                name: 'fileSize',
                title: 'File Size',
            },
            {
                name: 'error',
                title: 'Errors',
            },
        ],
    });
    entries.forEach(([tabName, { elapsed, severity, error, fileSize }]) => {
        if (severity === 'success') {
            tabTable.addRow({
                elapsed: divideAndRound(elapsed, 1000, 2),
                error: '-',
                fileSize: fileSizeFormatter(fileSize),
                severity: 'Success',
                tab: tabName,
            }, { color: 'green' });
        }
        else {
            severity = 'error';
            tabTable.addRow({
                elapsed: '-',
                error,
                fileSize: '-',
                severity: 'Error',
                tab: tabName,
            }, { color: 'red' });
        }
    });
    const tabTimeStr = tabTime < 0.01 ? '<0.01s' : `${divideAndRound(tabTime, 1000, 2)}s`;
    if (tabSeverity === 'success') {
        console.log(`${chalk.cyanBright('Tabs built')} ${chalk.greenBright('successfully')} in ${tabTimeStr}:\n${tabTable.render()}\n`);
    }
    else {
        console.log(`${chalk.cyanBright('Tabs failed with')} ${chalk.redBright('errors')} in ${tabTimeStr}:\n${tabTable.render()}\n`);
    }
};
export default async (buildOpts) => {
    buildOpts.modules = [];
    await fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true });
    console.log(`${chalk.cyanBright('Building the following tabs:')}\n${buildOpts.tabs.map((tabName, i) => `${i + 1}. ${tabName}`)
        .join('\n')}\n`);
    const { tabs } = await buildModules(buildOpts);
    logTabResults(tabs);
};
// export const buildTabs = wrapWithTimer(async (
//   buildOpts: BuildOptions,
//   tabs: string[],
// ) => {
//   const tabResults: Record<string, BuildResult> = {};
//   let tabSeverity: Severity = 'success';
//   await fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true });
//   await esbuild({
//     ...esbuildOptions,
//     entryPoints: tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`),
//     outdir: `${buildOpts.outDir}/tabs`,
//     plugins: [
//       {
//         name: 'tabPlugin',
//         setup(pluginBuild) {
//           pluginBuild.onEnd(({ outputFiles }) => Promise.all(outputFiles.map(async ({ path, text }) => {
//             const { dir } = pathlib.parse(path);
//             const tabName = pathlib.basename(dir);
//             const result = await outputTab(tabName, text, buildOpts);
//             if (result.severity === 'error') tabSeverity = 'error';
//             tabResults[tabName] = result;
//           })) as unknown as Promise<void>);
//         },
//       },
//     ],
//   });
//   return {
//     overall: tabSeverity,
//     results: tabResults,
//   };
// });
// export const watchTabs = (
//   buildOpts: BuildOptions,
//   tabs: string[],
// ) => fs.mkdir(`${buildOpts.outDir}/tabs`, { recursive: true })
//   .then(() => esbuild({
//     ...esbuildOptions,
//     entryPoints: tabs.map((tabName) => `${buildOpts.srcDir}/tabs/${tabName}/index.tsx`),
//     outdir: `${buildOpts.outDir}/tabs`,
//     watch: {
//       async onRebuild(_, { outputFiles }) {
//         const strings = await Promise.all(outputFiles.map(async ({ path, text }) => {
//           const { dir } = pathlib.parse(path);
//           const tabName = pathlib.basename(dir);
//           const { severity, error } = await outputTab(tabName, text, buildOpts);
//           if (severity === 'success') {
//             return `${chalk.cyanBright(`${tabName} built`)} ${chalk.greenBright('successfully')}`;
//           }
//           return `${chalk.cyanBright(`${tabName} build`)} ${chalk.redBright('failed')}: ${error}`;
//         }));
//         console.log(strings.join('\n'));
//       },
//     },
//   }));
