import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

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

export type ModuleManifest = Record<string, {
  tabs: string[]
}>;
