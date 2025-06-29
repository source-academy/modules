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
        '**/dist/**',
        '**/__mocks__/**',
        '**/__test_mocks__/**',
        '**/bin/**',
        '**/build.js',
        `${import.meta.dirname}/lib/buildtools/src/build/docs/drawdown.ts`
      ]
    },
    projects: [
      './lib/*/vitest.config.js',
      './devserver/vite.config.ts',
      './src/*/vitest.config.js'
    ],
    root: import.meta.dirname,
    silent: 'passed-only',
    watch: false
  }
});
