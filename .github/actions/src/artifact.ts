import fs from 'fs/promises';
import pathlib from 'path';
import { ArtifactNotFoundError, DefaultArtifactClient } from '@actions/artifact';
import * as core from '@actions/core';
import { exec } from '@actions/exec';
import { outDir } from '@sourceacademy/modules-repotools/getGitRoot';
import type { BundleManifest, ResolvedBundle, ResolvedTab } from '@sourceacademy/modules-repotools/types';
import { filterAsync } from 'es-toolkit';

/**
 * If the given bundles or tabs have already been built, then restore the built version
 * using the {@link DefaultArtifactClient}. Otherwise, focus those workspaces, and then
 * run the appropriate build commands.
 */
export async function loadOrBuildAsset(bundles: ResolvedBundle[], tabs: ResolvedTab[], manifest?: boolean) {
  const artifact = new DefaultArtifactClient();
  console.log('loading these tabs', tabs);

  const tabsPromise = filterAsync(tabs, async ({ name: tabName }) => {
    try {
      const { artifact: { id } } = await artifact.getArtifact(`${tabName}-tab`);
      await artifact.downloadArtifact(id, { path: pathlib.join(outDir, 'tabs') });
      core.info(`Downloaded artifact for ${tabName} tab`);
      return false;
    } catch (error) {
      if (!(error instanceof ArtifactNotFoundError)) {
        throw error;
      }
      core.error(`Error retrieving artifact for ${tabName} tab, need to try building`);
      return true;
    }
  });

  const bundlesPromise = filterAsync(bundles, async ({ name: bundleName }) => {
    try {
      const { artifact: { id } } = await artifact.getArtifact(`${bundleName}-bundle`);
      await artifact.downloadArtifact(id, { path: pathlib.join(outDir, 'bundles') });
      core.info(`Downloaded artifact for ${bundleName} bundle`);
      return false;
    } catch (error) {
      if (!(error instanceof ArtifactNotFoundError)) {
        throw error;
      }
      core.error(`Error retrieving artifact for ${bundleName} bundle, need to try building`);
      return true;
    }
  });

  const manifestPromise = (async () => {
    if (!manifest || bundles.length === 0) return;

    try {
      const { artifact: { id } } = await artifact.getArtifact('manifest');
      await artifact.downloadArtifact(id, { path: outDir });
    } catch (error) {
      if (!(error instanceof ArtifactNotFoundError)) {
        throw error;
      }

      const manifest = bundles.reduce<Record<string, BundleManifest>>((res, bundle) => ({
        ...res,
        [bundle.name]: bundle.manifest
      }), {});

      const outpath = pathlib.join(outDir, 'modules.json');
      await fs.writeFile(outpath, JSON.stringify(manifest));
    }
  })();

  const [bundlesToBuild, tabsToBuild] = await Promise.all([bundlesPromise, tabsPromise, manifestPromise]);

  const workspaces = [
    ...bundlesToBuild.map(({ name }) => `@sourceacademy/bundle-${name}`),
    ...tabsToBuild.map(({ name }) => `@sourceacademy/tab-${name}`),
  ];

  // focus all at once
  await exec('yarn workspaces focus', workspaces, { silent: false });

  // Then build everything
  const workspaceBuildArgs = workspaces.flatMap(each => ['--include', each]);
  await exec(
    'yarn workspaces foreach -pA',
    [...workspaceBuildArgs, 'run', 'build'],
    { silent: false }
  );
}
