// @ts-check
// Root vitest config
import pathlib from 'path';
import { defineConfig } from 'vitest/config';
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
    exclude: ['**/dist'],
    reporters: testReporters,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: coverageReporters,
      exclude: [
        '**/__mocks__',
        '**/build',
        '**/dist',
        '**/src/**/samples/**',
        pathlib.join(import.meta.dirname, 'lib/buildtools/src/build/docs/drawdown.ts'),
      ]
    },
    silent: 'passed-only'
  }
});
