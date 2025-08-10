// @ts-check
import rootConfig from '../../vitest.config.js';

/**
 * @type {import('vitest/config').ViteUserConfig}
 */
const config = {
  test: {
    ...rootConfig.test,
    name: 'Repo Tools',
    root: import.meta.dirname,
    include: ['**/__tests__/**/*.test.ts'],
    watch: false,
    projects: undefined
  }
};

export default config;
