// @ts-check
// Root vitest config
import pathlib from 'path';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import GithubActionsSummaryReporter from './lib/vitest-reporter/build/test-reporter.js';

const coverageReporters = ['text'];

/**
 * @type {Exclude<import('vitest/config').ViteUserConfig['test'], undefined>['reporters']}
 */
const testReporters = ['default'];

if (process.env.GITHUB_ACTIONS) {
  const reporter = pathlib.resolve(import.meta.dirname, './lib/vitest-reporter/build/coverage-reporter.cjs');
  coverageReporters.push(reporter);
  testReporters.push(new GithubActionsSummaryReporter());
} else {
  coverageReporters.push('html');
}

export default defineConfig({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: pathlib.join(import.meta.dirname, 'src/__mocks__/context.ts')
    }]
  },
  test: {
    projects: [
      './.github/actions',
      './devserver',
      './lib/*',
      './src/bundles/*',
      './src/tabs/*'
    ],
    reporters: testReporters,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: coverageReporters,
      extension: ['.ts', '.cts', '.tsx'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        './build/**',
        '**/coverage/**',
        '**/__mocks__/**',
        '**/__test_mocks__/**',
        '**/bin/**',
        '**/build.js',
        '**/*.config.?(c)[jt]s',
        '**/dist/**',
        '**/dist.?(c)js',
        './docs',
        '**/src/**/samples/**',
        '**/vitest.setup.[jt]s',
        pathlib.join(import.meta.dirname, 'lib/buildtools/src/build/docs/drawdown.ts'),
        pathlib.join(import.meta.dirname, 'lib/vitest-reporter/build/**')
      ]
    },
    silent: 'passed-only'
  }
});
