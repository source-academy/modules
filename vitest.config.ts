// Root vitest config
import { join } from 'path';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

const testProjects = [
  './lib/buildtools',
  './lib/lintplugin',
  './lib/modules-lib',
  './src/bundles',
  './src/tabs'
].map(p => join(import.meta.dirname, p, 'vitest.config.ts'));

export default defineConfig({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: `${import.meta.dirname}/src/__mocks__/context.ts`
    }]
  },
  test: {
    projects: [
      ...testProjects,
      join(import.meta.dirname, 'devserver', 'vite.config.ts')
    ],
    watch: false,
    silent: 'passed-only',
    coverage: {
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/dist/**',
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
