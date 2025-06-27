import fs from 'fs/promises';
import { getTabsDir } from '../getGitRoot.js';
import type { PrebuildOptions } from '../prebuild/index.js';
import type { ResolvedBundle } from '../types.js';
import { buildDocs } from './docs/index.js';
import { writeManifest } from './manifest/index.js';
import { buildBundles, buildTabs } from './modules/index.js';

/**
 * Build bundles, tabs, documentation and writes the manifest to the output directory
 */
export default async function buildAll(manifest: Record<string, ResolvedBundle>, opts: PrebuildOptions, outDir: string) {
  await fs.mkdir(outDir, { recursive: true });

  return Promise.all([
    writeManifest(outDir, manifest),
    buildDocs(manifest, outDir),
    buildBundles(manifest, opts, outDir),
    getTabsDir().then(tabsDir => buildTabs(manifest, tabsDir, opts, outDir))
  ]);
}
