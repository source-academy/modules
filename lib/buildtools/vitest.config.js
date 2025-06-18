// @ts-check
// Buildtools Vitest config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      clearMocks: true,
      environment: 'node',
      name: 'Build Tools',
      setupFiles: [`${import.meta.dirname}/vitest.setup.ts`],
      include: [`${import.meta.dirname}/**/__tests__/*.test.ts`]
    }
  })
);
