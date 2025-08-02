// @ts-check
// Root vitest config
import pathlib from 'path';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: pathlib.join(import.meta.dirname, 'src/__mocks__/context.ts')
    }]
  },
  test: {
    projects: [
      './devserver',
      './lib/*',
      './src/bundles/*',
      './src/tabs/*'
    ],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        './build/**',
        '**/__mocks__/**',
        '**/__test_mocks__/**',
        '**/bin/**',
        '**/build.js',
        '**/*.config.?(c)[jt]s',
        '**/dist/**',
        '**/dist.?(c)js',
        './docs',
        '**/src/**/samples/**',
        './lib/buildtools/src/build/docs/drawdown.ts'
      ]
    },
    silent: 'passed-only',
  }
});
