import fs from 'fs/promises';
import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadConfigFromFile } from 'vite';
import { defineProject, mergeConfig, type TestProjectInlineConfiguration, type ViteUserConfig } from 'vitest/config';
// @ts-expect-error I'm too lazy to make the root config work with typescript
import rootConfig from '../../../vitest.config.js';

rootConfig.test.projects = undefined;
rootConfig.test.environment = 'jsdom';

/**
 * A shared Vitest configuration object that can be combined with {@link mergeConfig}
 * to create custom Vitest configurations for each sub project
 */
export const baseVitestConfig: ViteUserConfig = rootConfig;

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
    'vitest.config.js',
    'vite.config.ts'
  ];

  for (const fileToTry of filesToTry) {
    try {
      const fullPath = pathlib.join(directory, fileToTry);
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
  return null;
}
