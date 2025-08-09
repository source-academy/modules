import fs from 'fs/promises';
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

  await fs.mkdir(outDir);

  const outpath = `${outDir}/modules.json`;
  await fs.writeFile(outpath, JSON.stringify(finalManifest, null, 2));

  return {
    severity: 'success',
    path: outpath
  };
}
