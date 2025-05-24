// Root vitest config
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    workspace: [
      'lib/*/vitest.config.ts',
      './devserver/vite.config.ts',
      './src/bundles',
      './src/tabs'
    ],
    coverage: {
      provider: 'v8',
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/__mocks__/**',
        '**/__test_mocks__/**',
        '**/bin/**',
        '**/build.js'
      ]
    }
  }
});
