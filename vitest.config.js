// @ts-check
// Root vitest config
import pathlib from 'path';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

const coverageReporters = ['text'];
if (process.env.GITHUB_ACTIONS) {
  const reporter = pathlib.resolve(import.meta.dirname, './lib/reporters/dist.cjs');
  coverageReporters.push(reporter);
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
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: coverageReporters,
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
        `${import.meta.dirname}/lib/buildtools/src/build/docs/drawdown.ts`
      ]
    },
    silent: 'passed-only',
  }
});
