import { parse } from 'acorn';
import { generate } from 'astring';
import { build } from 'esbuild';
import type {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Literal,
  MemberExpression,
  Program,
  ReturnStatement,
  VariableDeclaration,
} from 'estree';
import fs from 'fs/promises';

import manifest from '../modules.json' assert { type: 'json' };

const processModule = async (module: string) => {
  const { outputFiles: [{ text }] } = await build({
    bundle: true,
    entryPoints: [`src/bundles/${module}/index.ts`],
    format: 'iife',
    globalName: 'moduleExports',
    loader: {
      '.ts': 'ts',
    },
    platform: 'browser',
    plugins: [
      {
        name: 'yippee',
        setup(pluginBuild) {
          pluginBuild.onResolve({
            filter: /js-slang\/moduleHelpers/u,
          }, (args) => ({
            path: args.path,
            namespace: 'js-slang-context',
          }));

          pluginBuild.onLoad({
            filter: /.*/u,
            namespace: 'js-slang-context',
          }, () => ({
            contents: 'export const context = moduleHelpers.context;',
          }));
        },
      },
    ],
    tsconfig: 'src/tsconfig.json',
    write: false,
  });

  const parsed = parse(text, { ecmaVersion: 'latest' }) as unknown as Program;

  const exprStatement = parsed.body[1] as unknown as VariableDeclaration;
  const varDeclarator = exprStatement.declarations[0];
  const callExpression = varDeclarator.init as CallExpression;
  const moduleCode = callExpression.callee as ArrowFunctionExpression;

  const newModule = {
    type: 'ExpressionStatement',
    expression:
    {
      type: 'FunctionExpression',
      params: [
        {
          type: 'Identifier',
          name: 'moduleHelpers',
        } as Identifier,
      ],
      body: moduleCode.body,
      // Code to use if the use strict directive is still needed
      // body: {
      //   type: 'BlockStatement',
      //   body: [
      //     {
      //       type: 'ExpressionStatement',
      //       expression: {
      //         type: 'Literal',
      //         value: 'use strict',
      //       } as Literal,
      //     },
      //     ...(moduleCode.body as BlockStatement).body,
      //   ],
      // } as BlockStatement,
    } as FunctionExpression,
  } as ExpressionStatement;

  let newCode = generate(newModule);
  if (newCode.endsWith(';')) newCode = newCode.slice(0, -1);

  await fs.writeFile(`esbuild/bundles/${module}.js`, newCode);
};

const processTab = async (tab: string) => {
  const { outputFiles: [{ text }] } = await build({
    bundle: true,
    entryPoints: [`src/tabs/${tab}/index.tsx`],
    external: ['react', 'react-dom'],
    format: 'iife',
    globalName: 'tab',
    jsx: 'transform',
    loader: {
      '.tsx': 'tsx',
    },
    platform: 'browser',
    tsconfig: 'src/tsconfig.json',
    write: false,
  });

  const parsed = parse(text, { ecmaVersion: 'latest' }) as unknown as Program;
  const declStatement = parsed.body[1] as VariableDeclaration;

  const newModule = {
    type: 'ExpressionStatement',
    expression: {
      type: 'FunctionExpression',
      params: [
        {
          type: 'Identifier',
          name: '_React',
        } as Identifier,
        {
          type: 'Identifier',
          name: 'ReactDOM',
        } as Identifier,
      ],
      body: {
        type: 'BlockStatement',
        body: [
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

  let newCode = generate(newModule);
  if (newCode.endsWith(';')) newCode = newCode.slice(0, -1);

  newCode = newCode.replace(/__require\("react"\)/gu, '_React');
  newCode = newCode.replace(/__require\("react-dom"\)/gu, 'ReactDOM');

  await fs.writeFile(`esbuild/tabs/${tab}.js`, newCode);
};

async function main() {
  const entryPoints = Object.keys(manifest);
  const tabs = Object.values(manifest).flatMap(x => x.tabs);
  const promises = entryPoints.map(processModule).concat(tabs.map(processTab));

  await Promise.all(promises);
}

await main();
