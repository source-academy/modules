import type { ViteUserConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

const config: ViteUserConfig = {
  ...rootConfig,
  test: {
    ...rootConfig.test,
    name: 'Repo Tools',
    environment: 'node',
    root: import.meta.dirname,
    include: ['**/__tests__/**/*.test.ts'],
    watch: false,
    projects: undefined,
    setupFiles: ['vitest.setup.ts'],
  }
};

export default config;
