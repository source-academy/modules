import type { ViteUserConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

const config: ViteUserConfig = {
  ...rootConfig,
  test: {
    ...rootConfig.test,
    name: 'Modules Test Plugin',
    environment: 'node',
    root: import.meta.dirname,
    include: ['**/__tests__/**/*.test.ts'],
    watch: false,
    projects: undefined
  }
};

export default config;
