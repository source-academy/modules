import pathlib from 'path';
import { ArtifactNotFoundError, DefaultArtifactClient } from '@actions/artifact';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { bundlesDir, outDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveAllTabs } from '@sourceacademy/modules-repotools/manifest';

export async function main() {
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

  const tabPromises = Object.keys(tabsResult.tabs).map(async (tabName): Promise<string | null> => {
    try {
      const { artifact: { id } } = await artifact.getArtifact(`${tabName}-tab`);
      await artifact.downloadArtifact(id, { path: pathlib.join(outDir, 'tabs') });
      core.info(`Downloaded artifact for ${tabName}`);
      return null;
    } catch (error) {
      if (!(error instanceof ArtifactNotFoundError)) {
        throw error;
      }
      core.error(`Error retrieving artifact for ${tabName}, need to try building`);
      return tabName;
    }
  });

  // Artifacts could not be found, we probably need to build it
  const tabsToBuild = (await Promise.all(tabPromises)).filter(x => x !== null);
  if (tabsToBuild.length === 0) return;

  // focus all at once
  const workspaces = tabsToBuild.map(each => `@sourceacademy/tab-${each}`);
  const focusExitCode = await exec('yarn workspaces focus', workspaces, { silent: false });
  if (focusExitCode !== 0) {
    core.setFailed('yarn workspace focus failed');
    return;
  }

  const workspaceBuildArgs = workspaces.map(each => `--include ${each}`);
  const buildExitCode = await exec(
    'yarn workspaces foreach -pA',
    [...workspaceBuildArgs, 'run', 'build'],
    { silent: false }
  );
  if (buildExitCode !== 0) {
    core.setFailed('Building tabs failed');
  }
}

if (process.env.GITHUB_ACTIONS) {
  // Only automatically execute when running in github actions
  try {
    await main();
  } catch (error: any) {
    core.setFailed(error);
  }
}
