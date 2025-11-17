import fs from 'fs/promises';
import pathlib from 'path';
import type { BundleManifest, ErrorDiagnostic, ResolvedBundle, ResultTypeWithoutWarn } from '../../types.js';
import { isNodeError, objectEntries } from '../../utils.js';

type BuildManifestResult = ResultTypeWithoutWarn<ErrorDiagnostic, { path: string }>;

/**
 * Writes the combined modules' manifest to the output directory
 */
export async function buildManifest(bundles: Record<string, ResolvedBundle>, outDir: string): Promise<BuildManifestResult> {
  const finalManifest = objectEntries(bundles).reduce<Record<string, BundleManifest>>((res, [name, { manifest }]) => ({
    ...res,
    [name]: manifest
  }), {});

  // TODO: Just use fs-extra which has .ensureDir (graceful-fs under the hood)
  try {
    await fs.mkdir(outDir, { recursive: true });
  } catch (err) {
    if (!isNodeError(err) || err.code !== 'EEXIST') throw err;
  }

  const outpath = pathlib.join(outDir, 'modules.json');
  await fs.writeFile(outpath, JSON.stringify(finalManifest, null, 2));

  return {
    severity: 'success',
    path: outpath
  };
}
