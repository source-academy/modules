import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export type ModuleManifest = Record<string, {
  tabs: string[]
}>;

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

  return console.log(`${header}\n${
    lst.map((str, i) => `${i + 1}. ${mappingFunction(str)}`)
      .join(sep)
  }`);
};
