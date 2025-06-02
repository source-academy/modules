// Root vitest config
import { join } from 'path';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

const otherWorkspaces = [
  './lib/buildtools',
  './lib/lintplugin',
  './lib/modules-lib',
  './devserver',
].map(p => join(import.meta.dirname, p));

export default defineConfig({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: `${import.meta.dirname}/src/__mocks__/context.ts`
    }]
  },
  test: {
    workspace: [
      {
        extends: true,
        test: {
          name: 'Bundles',
          include: [`${import.meta.dirname}/src/bundles/**/__tests__/*.ts`],
          environment: 'jsdom',
        }
      },
      {
        extends: true,
        test: {
          name: 'Tabs',
          include: [`${import.meta.dirname}/src/tabs/**/__tests__/*.{ts,tsx}`],
          environment: 'jsdom',
        }
      },
      ...otherWorkspaces
    ],
    coverage: {
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/__mocks__/**',
        '**/__test_mocks__/**',
        '**/bin/**',
        '**/build.js',
        `${import.meta.dirname}/lib/buildtools/src/build/docs/drawdown.ts`
      ]
    },
    clearMocks: true
  }
});
