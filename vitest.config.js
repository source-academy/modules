// @ts-check
// Root vitest config
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: `${import.meta.dirname}/src/__mocks__/context.ts`
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
    projects: [
      './devserver',
      './lib/*/vitest.config.js',
      './src/bundles',
      './src/tabs'
    ],
    root: import.meta.dirname,
    silent: 'passed-only',
    watch: false
  }
});
