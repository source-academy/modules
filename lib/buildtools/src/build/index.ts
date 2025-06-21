import fs from 'fs/promises';
import { getTabsDir } from '../getGitRoot.js';
import type { PrebuildOptions } from '../prebuild/index.js';
import { buildDocs } from './docs/index.js';
import { resolveAllBundles, writeManifest } from './manifest.js';
import { buildBundles, buildTabs } from './modules/index.js';

export default async function buildAll(bundlesDir: string, opts: PrebuildOptions, outDir: string) {
  const manifest = await resolveAllBundles(bundlesDir);

  await fs.mkdir(outDir, { recursive: true });

  return Promise.all([
    writeManifest(outDir, manifest),
    buildDocs(manifest, outDir),
    buildBundles(manifest, opts, outDir),
    getTabsDir().then(tabsDir => buildTabs(manifest, tabsDir, opts, outDir))
  ]);
}
