import pathlib from 'path';
import { DefaultArtifactClient } from '@actions/artifact';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { bundlesDir, outDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveAllTabs } from '@sourceacademy/modules-repotools/manifest';

async function main() {
  const artifact = new DefaultArtifactClient();
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

  const tabPromises = Object.keys(tabsResult.tabs).map(async tabName => {
    try {
      const { artifact: { id } } = await artifact.getArtifact(`${tabName}-tab`);
      await artifact.downloadArtifact(id, { path: pathlib.join(outDir, 'tabs') });
      core.info(`Downloaded artifact for ${tabName}`);
      return;
    } catch(error) {
      core.error(`Error retrieving artifact for ${tabName}, will try building`);
      core.error(error as Error);
    }

    // Artifact could not be found, we probably need to build it
    const focusExitCode = await exec('yarn', ['workspaces', 'focus', `@sourceacademy/tab-${tabName}`]);
    if (focusExitCode !== 0) {
      core.setFailed(`yarn workspace focus failed for ${tabName}`);
      return;
    }

    const buildExitCode = await exec('yarn', ['workspaces', 'foreach', '-A', '--include', `@sourceacademy/tab-${tabName}`, 'run', 'build']);
    if (buildExitCode !== 0) {
      core.setFailed(`Building ${tabName} failed`);
      return;
    }
    core.info(`Built ${tabName}`);
  });

  await Promise.all(tabPromises);
}

if (process.env.GITHUB_ACTIONS) {
  // Only automatically execute when running in github actions
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error.message);
  }
}
