import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import {
  type BuildOptions as ESBuildOptions,
  type OutputFile,
  type Plugin as ESBuildPlugin,
  build as esbuild,
} from 'esbuild';
import type {
  ExportDefaultDeclaration,
  Identifier,
  Literal,
  MemberExpression,
  Program,
  VariableDeclaration,
} from 'estree';
import fs from 'fs/promises';
import pathlib from 'path';

import { printList } from '../../scriptUtils.js';
import {
  copyManifest,
  createBuildCommand,
  exitOnError,
  logResult,
  retrieveTabs,
  tabNameExpander,
} from '../buildUtils.js';
import { prebuild } from '../prebuild/index.js';
import type { LintCommandInputs } from '../prebuild/lint.js';
import type { BuildCommandInputs, BuildOptions, BuildResult, UnreducedResult } from '../types';

import { esbuildOptions } from './moduleUtils.js';

const outputTab = async (tabName: string, text: string, outDir: string): Promise<Omit<BuildResult, 'elapsed'>> => {
  try {
    const parsed = parse(text, { ecmaVersion: 6 }) as unknown as Program;
    const declStatement = parsed.body[1] as VariableDeclaration;

    const newTab: ExportDefaultDeclaration = {
      type: 'ExportDefaultDeclaration',
      declaration: {
        type: 'ArrowFunctionExpression',
        expression: true,
        body: {
          type: 'MemberExpression',
          object: declStatement.declarations[0].init,
          property: {
            type: 'Literal',
            value: 'default',
          } as Literal,
          computed: true,
        } as MemberExpression,
        params: [{
          type: 'Identifier',
          name: 'require',
        } as Identifier],
      },
    };

    const outFile = `${outDir}/tabs/${tabName}.js`;
    await fs.writeFile(outFile, generate(newTab));
    const { size } = await fs.stat(outFile);
    return {
      severity: 'success',
      fileSize: size,
    };
  } catch (error) {
    return {
      severity: 'error',
      error,
    };
  }
};

const tabContextPlugin: ESBuildPlugin = {
  name: 'Tab Context',
  setup(build) {
    build.onResolve({ filter: /^js-slang\/context/u }, () => ({
      errors: [{
        text: 'If you see this message, it means that your tab code is importing js-slang/context directly or indirectly. Do not do this',
      }],
    }));
  },
};

export const getTabOptions = (tabs: string[], { srcDir, outDir }: Record<'srcDir' | 'outDir', string>): ESBuildOptions => {
  const nameExpander = tabNameExpander(srcDir);
  return {
    ...esbuildOptions,
    entryPoints: tabs.map(nameExpander),
    external: [
      ...esbuildOptions.external,
      'react',
      'react-ace',
      'react-dom',
      'react/jsx-runtime',
      '@blueprintjs/*',
      // 'phaser',
    ],
    jsx: 'automatic',
    outbase: outDir,
    outdir: outDir,
    tsconfig: `${srcDir}/tsconfig.json`,
    plugins: [tabContextPlugin],
  };
};

export const buildTabs = async (tabs: string[], options: BuildOptions) => {
  const { outputFiles } = await esbuild(getTabOptions(tabs, options));
  return outputFiles;
};

export const reduceTabOutputFiles = (outputFiles: OutputFile[], startTime: number, outDir: string) => Promise.all(outputFiles.map(async ({ path, text }) => {
  const [rawType, name] = path.split(pathlib.sep)
    .slice(-3, -1);

  if (rawType !== 'tabs') {
    throw new Error(`Expected only tabs, got ${rawType}`);
  }

  const result = await outputTab(name, text, outDir);
  return ['tab', name, {
    elapsed: performance.now() - startTime,
    ...result,
  }] as UnreducedResult;
}));

const getBuildTabsCommand = () => createBuildCommand('tabs', true)
  .argument('[tabs...]', 'Manually specify which tabs to build', null)
  .description('Build only tabs')
  .action(async (tabsOpt: string[] | null, { manifest, ...opts }: BuildCommandInputs & LintCommandInputs) => {
    const tabs = await retrieveTabs(manifest, tabsOpt);

    await prebuild(opts, {
      tabs,
      bundles: [],
    });

    printList(`${chalk.magentaBright('Building the following tabs:')}\n`, tabs);
    const startTime = performance.now();
    const [reducedRes] = await Promise.all([
      buildTabs(tabs, opts)
        .then((results) => reduceTabOutputFiles(results, startTime, opts.outDir)),
      copyManifest({
        outDir: opts.outDir,
        manifest,
      }),
    ]);
    logResult(reducedRes, opts.verbose);
    exitOnError(reducedRes);
  });


export default getBuildTabsCommand;
