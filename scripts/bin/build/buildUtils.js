import { Command } from 'commander';
import { retrieveManifest } from '../scriptUtils.js';
export const wrapWithTimer = (func) => async (...params) => {
    const startTime = performance.now();
    const result = await func(...params);
    const endTime = performance.now();
    return {
        elapsed: endTime - startTime,
        result,
    };
};
export const divideAndRound = (dividend, divisor, round) => (dividend / divisor).toFixed(round);
export const findSeverity = (items, processor) => {
    let severity = 'success';
    for (const item of items) {
        const itemSev = processor(item);
        if (itemSev === 'error')
            return 'error';
        if (itemSev === 'warn' && severity === 'success')
            severity = 'warn';
    }
    return severity;
};
export const fileSizeFormatter = (size) => {
    size /= 1000;
    if (size < 0.01)
        return '<0.01 KB';
    if (size >= 100)
        return `${divideAndRound(size, 1000, 2)} MB`;
    return `${size.toFixed(2)} KB`;
};
export const createBuildCommand = (name, handler) => {
    const cmd = new Command(name)
        .option('--outDir <outdir>', 'Output directory', 'build')
        .option('--srcDir <srcdir>', 'Source directory for files', 'src')
        .option('--manifest <file>', 'Manifest file', 'modules.json')
        .option('-m, --modules <modules...>', 'Manually specify which modules to build')
        .option('-v, --verbose', 'Display more information about the build results', false);
    if (handler) {
        return cmd.action(async (opts) => {
            const manifest = await retrieveManifest(opts.manifest);
            let bundles = Object.keys(manifest);
            let modulesSpecified = false;
            if (opts.modules) {
                const undefineds = opts.modules.filter((m) => !bundles.includes(m));
                if (undefineds.length > 0) {
                    throw new Error(`Unknown modules: ${undefineds.join(', ')}`);
                }
                bundles = opts.modules;
                modulesSpecified = true;
            }
            const tabs = bundles
                .flatMap((x) => manifest[x].tabs);
            await handler({
                srcDir: opts.srcDir,
                outDir: opts.outDir,
                bundles,
                manifest: opts.manifest,
                tabs,
                modulesSpecified,
                verbose: opts.verbose,
            });
        });
    }
    return cmd;
};
