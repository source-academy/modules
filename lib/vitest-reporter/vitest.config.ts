// vitest-reporter vitest config
import { defineConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

export default defineConfig({
  esbuild: {
    include: ['**/*.{cts,ts}']
  },
  optimizeDeps: {
    include: ['istanbul-lib-report'],
  },
  test: {
    ...rootConfig.test,
    projects: undefined,

    name: 'Vitest Reporters',
    root: import.meta.dirname,
    include: ['src/**/__tests__/*.test.{ts,tsx}'],
  }
});
