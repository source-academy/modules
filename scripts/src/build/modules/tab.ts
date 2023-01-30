import { parse } from 'acorn';
import { generate } from 'astring';
import chalk from 'chalk';
import { Command, Option } from 'commander';
import type {
  BlockStatement,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Literal,
  MemberExpression,
  Program,
  ReturnStatement,
  VariableDeclaration,
} from 'estree';
import { promises as fs } from 'fs';

import { printList } from '../../scriptUtils.js';
import { createBuildLogger, retrieveBundlesAndTabs } from '../buildUtils.js';
import { logLintResult } from '../prebuild/eslint.js';
import { preBuild } from '../prebuild/index.js';
import { logTscResults } from '../prebuild/tsc.js';
import type { BuildCommandInputs, BuildResult } from '../types';

import { buildModules } from './index.js';
import { requireCreator } from './moduleUtils.js';

/**
 * Imports that are provided at runtime
 */
const externals = {
  'react': '_react',
  'react-dom': 'ReactDOM',
};

export const outputTab = async (tabName: string, text: string, outDir: string): Promise<Omit<BuildResult, 'elapsed'>> => {
  try {
    const parsed = parse(text, { ecmaVersion: 6 }) as unknown as Program;
    const declStatement = parsed.body[1] as VariableDeclaration;

    const newTab = {
      type: 'ExpressionStatement',
      expression: {
        type: 'FunctionExpression',
        params: Object.values(externals)
          .map((name) => ({
            type: 'Identifier',
            name,
          }) as Identifier),
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
                } as Literal,
                computed: true,
              } as MemberExpression,
            } as ReturnStatement,
          ],
        } as BlockStatement,
      } as FunctionExpression,
    } as ExpressionStatement;

    let newCode = generate(newTab);
    if (newCode.endsWith(';')) newCode = newCode.slice(0, -1);

    const outFile = `${outDir}/tabs/${tabName}.js`;
    await fs.writeFile(outFile, newCode);
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

export const logTabResults = createBuildLogger('tab');

type TabCommandInputs = Omit<BuildCommandInputs, 'modules' | 'tabs'> & { fix: boolean; };

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
  .action(async (tabs: string[] | null, { manifest, ...opts }: TabCommandInputs) => {
    const [assets] = await Promise.all([
      retrieveBundlesAndTabs(manifest, [], tabs),
      fs.mkdir(`${opts.outDir}/tabs`, { recursive: true }),
    ]);

    const { tscResult, lintResult, proceed } = await preBuild(opts, assets);

    logLintResult(lintResult);
    logTscResults(tscResult, opts.srcDir);
    if (!proceed) return;

    printList(`${chalk.magentaBright('Building the following tabs:')}\n`, assets.tabs);
    const { tabs: tabResult } = await buildModules(opts, assets);
    logTabResults(tabResult, opts.verbose);
  });


export default buildTabsCommand;
