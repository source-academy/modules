import fs from 'fs/promises';
import { getTabsDir } from '../getGitRoot.js';
import type { PrebuildOptions } from '../prebuild/index.js';
import { buildDocs } from './docs/index.js';
import { resolveAllBundles, writeManifest } from './manifest.js';
import { buildBundles } from './modules/bundle.js';
import { buildTabs } from './modules/tab.js';

export default async function buildAll(bundlesDir: string, opts: PrebuildOptions, outDir: string) {
  const manifest = await resolveAllBundles(bundlesDir);

  await fs.mkdir(outDir, { recursive: true });

  await Promise.all([
    writeManifest(outDir, manifest),
    buildDocs(manifest, outDir),
    fs.mkdir(`${outDir}/bundles`, { recursive: true })
      .then(() => buildBundles(manifest, opts, outDir)),
    Promise.all([getTabsDir(), fs.mkdir(`${outDir}/tabs`, { recursive: true })])
      .then(([tabsDir]) => buildTabs(manifest, tabsDir, opts, outDir))
  ]);
}
