import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import type { Severity } from './build/types';

export type ModuleManifest = Record<string, {
  tabs: string[]
}>;

/**
 * Function to replicate `__dirname` in CommonJS modules
 * Use with `import.meta.url`
 */
export function cjsDirname(url: string) {
  return join(dirname(fileURLToPath(url)));
}

export const retrieveManifest = async (manifest: string) => {
  try {
    const rawManifest = await readFile(manifest, 'utf-8');
    return JSON.parse(rawManifest) as ModuleManifest;
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Could not locate manifest file at ${manifest}`);
    throw error;
  }
};

export const wrapWithTimer = <T extends (...params: any[]) => Promise<any>>(func: T) => async (...params: Parameters<T>): Promise<{
  elapsed: number,
  result: Awaited<ReturnType<typeof func>>
}> => {
  const startTime = performance.now();
  const result = await func(...params);
  const endTime = performance.now();

  return {
    elapsed: endTime - startTime,
    result,
  };
};

export const printList = <T = string>(header: string, lst: T[], mapper?: (each: T) => string, sep: string = '\n') => {
  const mappingFunction = mapper || ((each) => {
    if (typeof each === 'string') return each;
    return `${each}`;
  });

  console.log(`${header}\n${
    lst.map((str, i) => `${i + 1}. ${mappingFunction(str)}`)
      .join(sep)
  }`);
};

export const findSeverity = <T>(items: T[], converter: (item: T) => Severity) => {
  let output: Severity = 'success';
  for (const item of items) {
    const severity = converter(item);
    if (severity === 'error') return 'error';
    if (severity === 'warn') output = 'warn';
  }
  return output;
};

/**
 * Wait until the user presses 'ctrl+c' on the keyboard
 */
export const waitForQuit = () => new Promise<void>((resolve, reject) => {
  process.stdin.setRawMode(true);
  process.stdin.on('data', (data) => {
    const byteArray = [...data];
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C');
      process.stdin.setRawMode(false);
      resolve();
    }
  });
  process.stdin.on('error', reject);
});
