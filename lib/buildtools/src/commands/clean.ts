import fs from 'fs/promises';
import pathlib from 'path';
import { Argument, Command } from '@commander-js/extra-typings';
import { bundlesDir, outDir, tabsDir } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveAllBundles, resolveAllTabs } from '@sourceacademy/modules-repotools/manifest';
import type { ResultType } from '@sourceacademy/modules-repotools/types';
import { isNodeError } from '@sourceacademy/modules-repotools/utils';
import { mapAsync } from 'es-toolkit';

type HandleEnoentResult<T> = {
  ok: true;
  result?: T;
} | {
  ok: false;
  error: unknown;
};

/**
 * Wrapper for handling fs operations that ignore 'ENOENT' errors
 */
async function handleEnoent<T>(promise: Promise<T>): Promise<HandleEnoentResult<T>> {
  try {
    const result = await promise;
    return {
      ok: true,
      result
    };
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') {
      return {
        ok: false,
        error
      };
    };

    return { ok: true };
  }
}

type CleanResult = ResultType<object>;

async function cleanBundles(bundlesDir: string, outDir: string): Promise<CleanResult> {
  const bundleResult = await resolveAllBundles(bundlesDir);

  if (bundleResult.severity === 'error') {
    return bundleResult;
  }

  const results = await mapAsync(Object.values(bundleResult.bundles), async (bundle): Promise<string | undefined> => {
    const tsPath = pathlib.join(bundle.directory, 'dist');

    const dirStats = await handleEnoent(fs.stat(tsPath));
    if (!dirStats.ok) {
      return `Error occurred while cleaning ${bundle.name}: ${dirStats.error}`;
    }

    try {
      if (dirStats.result?.isDirectory()) {
        await fs.rm(tsPath, { recursive: true, force: true });
      }
    } catch (error) {
      return `Error occurred while cleaning ${bundle.name}: ${error}`;
    }

    const buildPath = pathlib.join(outDir, 'bundles', `${bundle.name}.js`);
    const rmbuildResult = await handleEnoent(fs.rm(buildPath));

    if (!rmbuildResult.ok) {
      return `Error occurred while cleaning ${bundle.name}: ${rmbuildResult.error}`;
    }

    return undefined;
  });

  const errors = results.filter(x => x !== undefined);
  if (errors.length > 0) {
    return {
      severity: 'error',
      errors
    };
  }

  return {
    severity: 'success'
  };
}

async function cleanTabs(bundlesDir: string, tabsDir: string, outDir: string): Promise<CleanResult> {
  const tabResult = await resolveAllTabs(bundlesDir, tabsDir);
  if (tabResult.severity === 'error') {
    return tabResult;
  }

  const results = await mapAsync(Object.values(tabResult.tabs), async tab => {
    const buildPath = pathlib.join(outDir, 'tabs', `${tab.name}.js`);
    const rmResult = await handleEnoent(fs.rm(buildPath));

    if (rmResult.ok) return undefined;

    return `Error while cleaning ${tab.name} tab: ${rmResult.error}`;
  });

  const errors = results.filter(x => x !== undefined);
  if (errors.length > 0) {
    return {
      severity: 'error',
      errors
    };
  }

  return { severity: 'success' };
}

export const getCleanCommand = () => new Command('clean')
  .description('Remove existing compiled and built assets')
  .addArgument(
    new Argument('[type]', 'Type of Asset to clean')
      .choices(['tabs', 'bundles'])
      .default('bundles')
  )
  .action(async asset => {
    switch (asset) {
      case 'bundles': {
        await cleanBundles(bundlesDir, outDir);
        break;
      }
      case 'tabs': {
        await cleanTabs(bundlesDir, tabsDir, outDir);
        break;
      }
    }
  });
