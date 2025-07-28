import react from '@vitejs/plugin-react';
import { defineProject, mergeConfig, type ViteUserConfig } from 'vitest/config';
// @ts-expect-error I'm too lazy to make the root config work with typescript
import rootConfig from '../../../../vitest.config.js';

rootConfig.test.projects = undefined;
rootConfig.test.environment = 'jsdom';

/**
 * A shared Vitest configuration object that can be combined with {@link mergeConfig}
 * to create custom Vitest configurations for each sub project
 */
export const sharedVitestConfiguration: ViteUserConfig = rootConfig;

/**
 * Vitest configuration specific to tabs
 */
export const sharedTabsConfig = mergeConfig(
  sharedVitestConfiguration,
  // @ts-expect-error help why are plugins weird
  defineProject({
    // @ts-expect-error help why are plugins weird
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
      include: ['**/__tests__/*.{ts,tsx}'],
      environment: 'jsdom',
      browser: {
        provider: 'playwright',
        instances: [{
          browser: 'chromium',
        }]
      }
    }
  })
);
