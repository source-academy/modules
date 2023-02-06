import { parse } from 'acorn';
import { generate } from 'astring';
import { build as esbuild } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';
import { bundleNameExpander } from '../buildUtils.js';
import { esbuildOptions, requireCreator } from './moduleUtils.js';
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
export const buildBundles = async (bundles, { srcDir, outDir }) => {
    const { outputFiles } = await esbuild({
        ...esbuildOptions,
        entryPoints: bundles.map(bundleNameExpander(srcDir)),
        outbase: outDir,
        outdir: outDir,
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
