import fs from 'fs/promises';

export type ModuleManifest = Record<string, { tabs: string[] }>;

export async function retrieveManifest(manifest: string) {
  try {
    const rawManifest = await fs.readFile(manifest, 'utf-8');
    return JSON.parse(rawManifest) as ModuleManifest;
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error(`Could not locate manifest file at ${manifest}`);
    throw error;
  }
}
