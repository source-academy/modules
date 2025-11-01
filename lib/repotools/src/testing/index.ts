import fs from 'fs/promises';
import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadConfigFromFile } from 'vite';
import { defineProject, mergeConfig, type ViteUserConfig } from 'vitest/config';
import { rootVitestConfigPath } from '../getGitRoot.js';
import loadVitestConfigFromDir from './loader.js';

async function loadRootConfig() {
  const loadResult = await loadConfigFromFile(
    { command: 'build', mode: '' },
    rootVitestConfigPath,
    undefined,
    'silent',
  );

  if (loadResult === null) {
    throw new Error('Failed to load root vitest configuration!');
  }

  const config = loadResult.config;
  config.test!.projects = undefined;
  config.test!.environment = 'jsdom';

  return config;
}

/**
 * Default inclusion pattern to be used for detecting test files
 */
export const testIncludePattern = '**/__tests__/**/*.test.{ts,tsx}';

/**
 * A shared Vitest configuration object that can be combined with {@link mergeConfig}
 * to create custom Vitest configurations for each sub project
 */
export const baseVitestConfig: ViteUserConfig = await loadRootConfig();

/**
 * Vitest configuration specific to tabs
 */
export const sharedTabsConfig = mergeConfig(
  baseVitestConfig,
  defineProject({
    plugins: [react()],
    optimizeDeps: {
      include: [
        '@blueprintjs/core',
        '@blueprintjs/icons',
        'gl-matrix',
        'js-slang',
        'lodash',
        'vitest-browser-react'
      ]
    },
    test: {
      environment: 'jsdom',
      browser: {
        provider: playwright(),
        instances: [{
          browser: 'chromium',
        }]
      }
    }
  })
);

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

export { loadVitestConfigFromDir };
