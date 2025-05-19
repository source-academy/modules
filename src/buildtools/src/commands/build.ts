import fs from 'fs/promises'
import { Command } from "@commander-js/extra-typings";
import { buildBundle, buildBundles, buildTab, buildTabs, writeManifest } from "../build/modules";
import { resolveAllBundles, resolveSingleBundle } from "../build/manifest";
import { initTypedocForSingleBundle } from '../build/docs/docsUtils';
import { buildDocs, buildJson } from '../build/docs';
import { getBundlesDir, getOutDir } from '../utils';

const outDir = await getOutDir()
const bundlesDir = await getBundlesDir()

export const getBuildBundleCommand = () => new Command('bundle')
  .argument('<bundle>', 'Directory in which the bundle\'s source files are located')
  .action(async bundleDir => {
    const bundle = await resolveSingleBundle(bundleDir)
    if (!bundle) {
      throw new Error(`No bundle found at ${bundleDir}!`)
    }
    await buildBundle(bundle, outDir)
  })

export const getBuildTabCommand = () => new Command('tab')
  .argument('<tab>', 'Directory in which the tab\'s source files are located')
  .action(tabDir => buildTab(tabDir, outDir))

export const getBuildJsonCommand = () => new Command('json')
  .argument('<bundle>', 'Directory in which the bundle\'s source files are located')
  .action(async bundleDir => {
    const bundle = await resolveSingleBundle(bundleDir)
    const reflection = await initTypedocForSingleBundle(bundle)
    await fs.mkdir(`${outDir}/json`, { recursive: true })
    await buildJson(bundle.name, reflection, outDir)
  })

export const getBuildDocsCommand = () => new Command('docs')
  .action(async ()  => {
    const manifest = await resolveAllBundles(bundlesDir)
    await buildDocs(manifest, outDir)
  })

export const getBuildManifestCommand = () => new Command('manifest')
  .action(async () => {
    const manifest = await resolveAllBundles(bundlesDir)
    await fs.mkdir(outDir, { recursive: true })
    await writeManifest(manifest, outDir)
  })

export const getBuildAllCommand = () => new Command('all')
.description('Build all bundles, tabs and documentation')
  .action(async () => {
    const manifest = await resolveAllBundles(bundlesDir)
    await fs.mkdir(outDir, { recursive: true })

    await Promise.all([
      writeManifest(manifest, outDir),
      buildDocs(manifest, outDir),
      buildBundles(manifest, outDir),
      buildTabs(manifest, outDir)
    ])
  })

export const getBuildCommand = () => new Command('build')
  .addCommand(getBuildAllCommand())
  .addCommand(getBuildBundleCommand())
  .addCommand(getBuildTabCommand())
  .addCommand(getBuildJsonCommand())
  .addCommand(getBuildDocsCommand())
  .addCommand(getBuildManifestCommand())
