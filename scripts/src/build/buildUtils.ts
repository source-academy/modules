import type { BuildOptions as ESBuildOptions } from 'esbuild';

import { cjsDirname } from '../scriptUtils';

import type { Severity } from './types';

export const wrapWithTimer = <T extends (...params: any[]) => Promise<any>>(func: T) => async (...params: Parameters<T>): Promise<{
  elapsed: number,
  result: Awaited<ReturnType<T>>
}> => {
  const startTime = performance.now();
  const result = await func(...params);
  const endTime = performance.now();

  return {
    elapsed: endTime - startTime,
    result,
  };
};

export const divideAndRound = (dividend: number, divisor: number, round: number) => (dividend / divisor).toFixed(round);

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

export const esbuildOptions: ESBuildOptions = {
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

export const findSeverity = <T>(items: T[], processor: (each: T) => Severity): Severity => {
  let severity: Severity = 'success';

  for (const item of items) {
    const itemSev = processor(item);
    if (itemSev === 'error') return 'error';
    if (itemSev === 'warn' && severity === 'success') severity = 'warn';
  }

  return severity;
};
