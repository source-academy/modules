import * as core from '@actions/core';
import { bundlesDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveAllBundles, resolveAllTabs } from '@sourceacademy/modules-repotools/manifest';
import type { ResolvedBundle, ResolvedTab } from '@sourceacademy/modules-repotools/types';
import { loadOrBuildAsset } from '../artifact';

export async function main() {
  let bundles: ResolvedBundle[] = [];
  if (core.getInput('load-bundles') === 'true') {
    const bundlesResult = await resolveAllBundles(bundlesDir);

    if (bundlesResult.severity === 'error') {
      core.startGroup('Bundles Resolution errors');
      for (const error of bundlesResult.errors) {
        core.error(error);
      }
      core.endGroup();
      core.setFailed('Bundle resolution failed with errors');
      return;
    }

    bundles = Object.values(bundlesResult.bundles);
  }

  let tabs: ResolvedTab[] = [];
  if (core.getInput('load-tabs') === 'true') {
    const tabsResult = await resolveAllTabs(bundlesDir, tabsDir);
    if (tabsResult.severity === 'error') {
      core.startGroup('Tab Resolution errors');
      for (const error of tabsResult.errors) {
        core.error(error);
      }
      core.endGroup();
      core.setFailed('Tab resolution failed with errors');
      return;
    }
    tabs = Object.values(tabsResult.tabs);
  }

  await loadOrBuildAsset(bundles, tabs, core.getInput('load-manifest') === 'true');
}

if (process.env.GITHUB_ACTIONS) {
  // Only automatically execute when running in github actions
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error);
  }
}
