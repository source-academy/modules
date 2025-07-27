// @ts-check
// Lint Plugin vitest config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Lint Plugin',
      environment: 'node',

      // Required because the ESLint rule tester tries to use the test helpers from
      // the global scope
      globals: true,
      include: [`${import.meta.dirname}/**/__tests__/*.test.ts`]
    }
  })
);
