import { cjsDirname } from '../scriptUtils';
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
// /**
//  * Get a new Lowdb instance
//  */
// export const getDb = async (buildOptions: BuildOptions) => {
//   const db = new Low(new JSONFile<DBData>(`${buildOptions.outDir}/${buildOptions.dbFile}`));
//   await db.read();
//   if (!db.data) {
//     // Set default data if database.json is missing
//     db.data = {
//       html: 0,
//       jsons: {},
//       bundles: {},
//       tabs: {},
//     };
//   }
//   return db;
// };
export const esbuildOptions = {
    bundle: true,
    external: ['react', 'react-dom', 'js-slang/moduleHelpers'],
    format: 'iife',
    globalName: 'module',
    inject: [`${cjsDirname(import.meta.url)}/import-shim.js`],
    loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
    },
    minify: true,
    platform: 'browser',
    target: 'es6',
    write: false,
};
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
