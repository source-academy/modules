import fs from 'fs/promises';
import pathlib from 'path';
import type { BundleManifest, ResolvedBundle, SuccessResult } from '@sourceacademy/modules-repotools/types';
import { objectEntries } from '@sourceacademy/modules-repotools/utils';

/**
 * Writes the combined modules' manifest to the output directory
 */
export async function buildManifest(bundles: Record<string, ResolvedBundle>, outDir: string): Promise<SuccessResult> {
  const finalManifest = objectEntries(bundles).reduce<Record<string, BundleManifest>>((res, [name, { manifest }]) => ({
    ...res,
    [name]: manifest
  }), {});

  // TODO: Just use fs-extra which has .ensureDir (graceful-fs under the hood)
  try {
    await fs.mkdir(outDir, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
  }

  const outpath = pathlib.join(outDir, 'modules.json');
  await fs.writeFile(outpath, JSON.stringify(finalManifest, null, 2));

  return {
    severity: 'success',
    path: outpath
  };
}
