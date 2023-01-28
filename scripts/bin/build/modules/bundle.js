import { parse } from 'acorn';
import { generate } from 'astring';
import { build as esbuild } from 'esbuild';
import { promises as fsPromises } from 'fs';
import pathlib from 'path';
import { esbuildOptions, requireCreator } from './moduleUtils.js';
const HELPER_NAME = 'moduleHelpers';
const outputBundle = async (name, bundleText, outDir) => {
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
export const buildBundles = async (bundles, opts) => {
    const { outputFiles } = await esbuild({
        ...esbuildOptions,
        entryPoints: bundles.map((bundle) => `${opts.srcDir}/bundles/${bundle}/index.ts`),
        outbase: opts.outDir,
        outdir: opts.outDir,
        external: ['js-slang/moduleHelpers'],
    });
    return outputFiles;
};
export const reduceBundleOutputFiles = (outputFiles, startTime, outDir) => Promise.all(outputFiles.map(async ({ path, text }) => {
    const [rawType, name] = path.split(pathlib.sep)
        .slice(-3, -1);
    if (rawType !== 'bundles') {
        throw new Error(`Expected only bundles, got ${rawType}`);
    }
    const result = await outputBundle(name, text, outDir);
    return ['bundle', name, {
            elapsed: performance.now() - startTime,
            ...result,
        }];
}));