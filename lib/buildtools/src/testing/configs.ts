import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { coverageConfigDefaults, defineConfig, defineProject, mergeConfig } from 'vitest/config';
import { getGitRoot } from '../getGitRoot.js';

const gitRoot = await getGitRoot();

/**
 * A shared Vitest configuration object that can be combined with {@link mergeConfig}
 * to create custom Vitest configurations for each sub project
 */
export const sharedVitestConfiguration = defineConfig({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: pathlib.join(gitRoot, 'src/__mocks__/context.ts')
    }]
  },
  test: {
    clearMocks: true,
    coverage: {
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        './build/**',
        '**/__mocks__/**',
        '**/__test_mocks__/**',
        '**/bin/**',
        '**/build.js',
        '**/*.config.?(c)[jt]s',
        '**/dist.?(c)js',
        './docs',
        '**/src/**/samples/**',
        './lib/buildtools/src/build/docs/drawdown.ts'
      ]
    },
    silent: 'passed-only',
  }
});

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
