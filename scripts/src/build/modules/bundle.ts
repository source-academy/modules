import { parse } from 'acorn';
import { generate } from 'astring';
import type {
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Program,
  VariableDeclaration,
} from 'estree';
import fs from 'fs/promises';

import type { BuildResult } from '../types.js';

import { requireCreator } from './moduleUtils.js';


const HELPER_NAME = 'moduleHelpers';

export const outputBundle = async (name: string, bundleText: string, outDir: string): Promise<Omit<BuildResult, 'elapsed'>> => {
  try {
    const parsed = parse(bundleText, { ecmaVersion: 6 }) as unknown as Program;
    const exprStatement = parsed.body[1] as unknown as VariableDeclaration;
    const varDeclarator = exprStatement.declarations[0];
    const callExpression = varDeclarator.init as CallExpression;
    const moduleCode = callExpression.callee as ArrowFunctionExpression;

    const output = {
      type: 'FunctionExpression',
      body: {
        type: 'BlockStatement',
        body: [
          requireCreator({
            'js-slang/moduleHelpers': HELPER_NAME,
          }),
          ...(moduleCode.body.type === 'BlockStatement'
            ? (moduleCode.body as BlockStatement).body
            : [{
              type: 'ExpressionStatement',
              expression: moduleCode.body,
            } as ExpressionStatement]),
        ],
      },
      params: [
        {
          type: 'Identifier',
          name: HELPER_NAME,
        } as Identifier,
      ],
    } as FunctionExpression;

    let newCode = generate(output);
    if (newCode.endsWith(';')) newCode = newCode.slice(0, -1);

    const outFile = `${outDir}/bundles/${name}.js`;
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
