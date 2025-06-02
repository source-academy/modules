import fs from 'fs/promises';
import { Command } from '@commander-js/extra-typings';
import { buildDocs, buildJson, formatBuildDocsResult } from '../build/docs';
import { initTypedocForSingleBundle } from '../build/docs/docsUtils';
import { resolveAllBundles, resolveSingleBundle } from '../build/manifest';
import { buildBundle, buildTab, buildTabs, writeManifest } from '../build/modules';
import { buildBundles } from '../build/modules/bundle';
import { getBundlesDir, getOutDir, getTabsDir } from '../getGitRoot';
import { resultLogger } from '../utils';

const outDir = await getOutDir();
const bundlesDir = await getBundlesDir();

export const getBuildBundleCommand = () => new Command('bundle')
  .argument('<bundle>', 'Directory in which the bundle\'s source files are located')
  .action(async bundleDir => {
    const bundle = await resolveSingleBundle(bundleDir);
    if (!bundle) {
      throw new Error(`No bundle found at ${bundleDir}!`);
    }
    await buildBundle(bundle, outDir);
  });

export const getBuildTabCommand = () => new Command('tab')
  .argument('<tab>', 'Directory in which the tab\'s source files are located')
  .action(async tabDir => {
    const tabsOutDir = await getTabsDir();
    const result = await buildTab(tabDir, tabsOutDir);
    console.log(resultLogger(result, 'Tab', `Tabs built at ${tabsOutDir}`));
  });

export const getBuildJsonCommand = () => new Command('json')
  .argument('<bundle>', 'Directory in which the bundle\'s source files are located')
  .option('--tsc', 'Ask Typedoc to run tsc typechecking')
  .action(async (bundleDir, { tsc }) => {
    const bundle = await resolveSingleBundle(bundleDir);
    if (!bundle) {
      throw new Error(`No bundle found at ${bundleDir}!`);
    }

    const reflection = await initTypedocForSingleBundle(bundle, !!tsc);
    await fs.mkdir(`${outDir}/jsons`, { recursive: true });
    const result = await buildJson(bundle.name, reflection, outDir);
    console.log(resultLogger(result, 'JSON', `JSONS built at ${outDir}/jsons`));
  });

export const getBuildDocsCommand = () => new Command('docs')
  .option('--tsc', 'Ask Typedoc to run tsc typechecking')
  .action(async ({ tsc }) => {
    const manifest = await resolveAllBundles(bundlesDir);
    const results = await buildDocs(manifest, outDir, !!tsc);
    console.log(formatBuildDocsResult(results, outDir));
  });

export const getBuildManifestCommand = () => new Command('manifest')
  .action(async () => {
    const manifest = await resolveAllBundles(bundlesDir);
    await fs.mkdir(outDir, { recursive: true });

    const results = await writeManifest(manifest, outDir);
    console.log(resultLogger(results, 'manifest', `Manifest written to ${outDir}`));
  });

export const getBuildAllCommand = () => new Command('all')
  .description('Build all bundles, tabs and documentation')
  .action(async () => {
    const manifest = await resolveAllBundles(bundlesDir);
    await fs.mkdir(outDir, { recursive: true });

    await Promise.all([
      writeManifest(manifest, outDir),
      buildDocs(manifest, outDir, false),
      buildBundles(manifest, outDir),
      getTabsDir().then(tabsDir => buildTabs(manifest, tabsDir, outDir))
    ]);
  });

export const getBuildCommand = () => new Command('build')
  .addCommand(getBuildAllCommand())
  .addCommand(getBuildBundleCommand())
  .addCommand(getBuildTabCommand())
  .addCommand(getBuildJsonCommand())
  .addCommand(getBuildDocsCommand())
  .addCommand(getBuildManifestCommand());
