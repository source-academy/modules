// Root vitest config
import pathlib from 'path';
import { defineConfig } from 'vitest/config';
import GithubActionsSummaryReporter from './lib/vitest-reporter/build/test-reporter.js';

const coverageReporters = ['text'];

const testReporters: Exclude<import('vitest/config').ViteUserConfig['test'], undefined>['reporters'] = ['default'];

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
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['**/dist'],
    reporters: testReporters,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: coverageReporters,
      include: [
        './src/{bundles,tabs}/**/*.{ts,tsx}',
        './lib/*/src/**/*.{ts,tsx}',
        './devserver/src/**/*.{ts,tsx}',
        './.github/actions/src/**/*.ts'
      ],
      exclude: [
        '**/__mocks__',
        '**/__tests__',
        '**/__test_mocks__',
        '**/build/**',
        '**/dist',
        '**/samples',
        pathlib.join(import.meta.dirname, 'lib/buildtools/src/build/docs/drawdown.ts'),
      ]
    },
    silent: 'passed-only'
  }
});
