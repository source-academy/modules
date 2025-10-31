import fs from 'fs/promises';
import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadConfigFromFile } from 'vite';
import { defineProject, mergeConfig, type TestProjectInlineConfiguration, type ViteUserConfig } from 'vitest/config';
import { rootVitestConfigPath } from './getGitRoot.js';

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
      include: ['**/__tests__/**/*.{ts,tsx}'],
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
 * Try to load the `vitest.config.js` from the given
 * directory. If it doesn't exist, then return `null`.
 */
export async function loadVitestConfigFromDir(directory: string) {
  const filesToTry = [
    'vitest.config',
    'vite.config'
  ];

  const extensionsToTry = ['ts', 'js']

  for (const fileToTry of filesToTry) {
    for (const extToTry of extensionsToTry) {
      try {
        const fullPath = pathlib.join(directory, `${fileToTry}.${extToTry}`);
        await fs.access(fullPath, fs.constants.R_OK);
        const config = await loadConfigFromFile(
          { command: 'build', mode: '' },
          fullPath,
          undefined,
          'silent',
        );

        if (config !== null) return config.config as TestProjectInlineConfiguration;
      } catch {}

    }
  }
  return null;
}
