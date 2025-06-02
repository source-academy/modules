import fs from 'fs/promises';
import { dirname } from 'path';
import { startVitest, type VitestRunMode } from 'vitest/node';
import { getGitRoot } from './getGitRoot';
import { isNodeError } from './utils';

/**
 * Crawl upwards from the current directory, searching for a vitest.config.ts\
 * If none can be found once the git root has been reached, return `undefined`.
 */
async function searchForConfig(directory: string) {
  const gitRoot = await getGitRoot();

  try {
    await fs.access(`${directory}/vitest.config.ts`, fs.constants.R_OK);
    return `${directory}/vitest.config.ts`;
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    if (directory === gitRoot) return undefined;

    const parentDirectory = dirname(directory);
    return searchForConfig(parentDirectory);
  }
}

export default async function runVitest(mode: VitestRunMode, directory: string, watch: boolean) {
  const vitestConfigPath = await searchForConfig(directory);
  if (vitestConfigPath === undefined) throw new Error('Failed to find vitest.config.ts');
  console.log('vitest config', vitestConfigPath);

  return startVitest(mode, [directory, '--config', vitestConfigPath], {
    watch,
  }, { });
}
