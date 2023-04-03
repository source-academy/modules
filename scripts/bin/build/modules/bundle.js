import { parse } from 'acorn';
import { generate } from 'astring';
import { build as esbuild, } from 'esbuild';
import fs from 'fs/promises';
import pathlib from 'path';
import { bundleNameExpander } from '../buildUtils.js';
import { esbuildOptions } from './moduleUtils.js';
export const outputBundle = async (name, bundleText, outDir) => {
    try {
        const parsed = parse(bundleText, { ecmaVersion: 6 });
        // Account for 'use strict'; directives
        let declStatement;
        if (parsed.body[0].type === 'VariableDeclaration') {
            declStatement = parsed.body[0];
        }
        else {
            declStatement = parsed.body[1];
        }
        const varDeclarator = declStatement.declarations[0];
        const callExpression = varDeclarator.init;
        const moduleCode = callExpression.callee;
        const output = {
            type: 'ArrowFunctionExpression',
            body: {
                type: 'BlockStatement',
                body: moduleCode.body.type === 'BlockStatement'
                    ? moduleCode.body.body
                    : [{
                            type: 'ExpressionStatement',
                            expression: moduleCode.body,
                        }],
            },
            params: [
                {
                    type: 'Identifier',
                    name: 'require',
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
        console.log(error);
        return {
            severity: 'error',
            error,
        };
    }
};
export const bundleOptions = {
    ...esbuildOptions,
    external: ['js-slang*'],
};
export const buildBundles = async (bundles, { srcDir, outDir }) => {
    const nameExpander = bundleNameExpander(srcDir);
    const { outputFiles } = await esbuild({
        ...bundleOptions,
        entryPoints: bundles.map(nameExpander),
        outbase: outDir,
        outdir: outDir,
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
