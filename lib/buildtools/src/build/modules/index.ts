import fs from 'fs/promises';
import uniq from 'lodash/uniq.js';
import { type PrebuildOptions, runBuilderWithPrebuild } from '../../prebuild/index.js';
import type { FullResult, ResolvedBundle, TabResultEntry } from '../../types.js';
import { resolveSingleTab } from '../manifest.js';
import { buildBundle } from './bundle.js';
import { buildTab } from './tab.js';

export { buildBundle, buildTab };

/**
 * Build all the provided bundles at once
 */
export async function buildBundles(resolvedBundles: Record<string, ResolvedBundle>, options: PrebuildOptions, outDir: string) {
  await fs.mkdir(`${outDir}/bundles`, { recursive: true });
  return Promise.all(Object.values(resolvedBundles).map(bundle => runBuilderWithPrebuild(buildBundle, options, bundle, outDir, undefined)));
}

/**
 * Find all the tabs within the given directory and build them all at once
 */
export async function buildTabs(resolvedBundles: Record<string, ResolvedBundle>, tabsDir: string, prebuildOpts: PrebuildOptions, outDir: string) {
  await fs.mkdir(`${outDir}/tabs`, { recursive: true });
  const tabNames = uniq(Object.values(resolvedBundles).flatMap(({ manifest: { tabs } }) => tabs ?? []));
  return Promise.all(
    tabNames.map(async (tabName): Promise<FullResult<TabResultEntry>> => {
      const tab = await resolveSingleTab(`${tabsDir}/${tabName}`);
      if (!tab) {
        return {
          results: {
            severity: 'error',
            assetType: 'tab',
            inputName: tabName,
            message: `Could not find tab at ${tabsDir}/${tabName}!`
          }
        };
      }

      return runBuilderWithPrebuild(buildTab, prebuildOpts, tab, outDir, undefined);
    }));
}
