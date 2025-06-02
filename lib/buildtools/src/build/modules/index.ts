import fs from 'fs/promises';
import type { BuildResult } from '../../utils';
import type { ResolvedBundle } from '../manifest';

/**
 * Writes the module manifest to the output directory
 */
export async function writeManifest(resolvedBundles: Record<string, ResolvedBundle>, outDir: string): Promise<BuildResult> {
  try {
    const toWrite = Object.entries(resolvedBundles).reduce((res, [key, { manifest }]) => ({
      ...res,
      [key]: manifest
    }), {});
    await fs.writeFile(`${outDir}/modules.json`, JSON.stringify(toWrite, null, 2));
    return {
      severity: 'success',
      warnings: [],
      errors: []
    };
  } catch (error) {
    return {
      severity: 'error',
      warnings: [],
      errors: [`${error}`]
    };
  }
}

export { buildBundle, buildBundles } from './bundle';
export { buildTab, buildTabs } from './tab';
