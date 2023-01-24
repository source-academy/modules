import { parse } from 'acorn';
import { generate } from 'astring';
import { promises as fsPromises } from 'fs';
import { requireCreator } from './moduleUtils.js';
const HELPER_NAME = 'moduleHelpers';
export const outputBundle = async (name, bundleText, outDir) => {
    try {
        const parsed = parse(bundleText, { ecmaVersion: 6 });
        const exprStatement = parsed.body[1];
        const varDeclarator = exprStatement.declarations[0];
        const callExpression = varDeclarator.init;
        const moduleCode = callExpression.callee;
        const output = {
            type: 'FunctionExpression',
            body: {
                type: 'BlockStatement',
                body: [
                    requireCreator({
                        'js-slang/moduleHelpers': HELPER_NAME,
                    }),
                    ...(moduleCode.body.type === 'BlockStatement'
                        ? moduleCode.body.body
                        : [{
                                type: 'ExpressionStatement',
                                expression: moduleCode.body,
                            }]),
                ],
            },
            params: [
                {
                    type: 'Identifier',
                    name: HELPER_NAME,
                },
            ],
        };
        let newCode = generate(output);
        if (newCode.endsWith(';'))
            newCode = newCode.slice(0, -1);
        const outFile = `${outDir}/bundles/${name}.js`;
        await fsPromises.writeFile(outFile, newCode);
        const { size } = await fsPromises.stat(outFile);
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
