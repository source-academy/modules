import fs from 'fs/promises';
import pathlib from 'path';
import loadVitestConfigFromDir from './loader.js';

/**
 * Default inclusion pattern to be used for detecting test files
 */
export const testIncludePattern = '**/__tests__/**/*.test.{ts,tsx}';

/**
 * For a given directory, recurse through it and determine if the given directory is
 * supposed to contain test files within it
 */
export async function isTestDirectory(directory: string): Promise<boolean> {
  try {
    // If the given folder has a vitest config, we assume the folder is
    // supposed to contain tests
    const config = await loadVitestConfigFromDir(directory);
    if (config) return true;
  } catch { }

  const testGlobPath = pathlib.join(directory, testIncludePattern);

  for await (const _ of fs.glob(testGlobPath)) {
    return true;
  }

  return false;
}
