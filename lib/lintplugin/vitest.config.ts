// Lint Plugin vitest config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Lint Plugin',
      environment: 'node',

      // Required because the ESLint rule tester tries to use the test helpers from
      // the global scope
      globals: true
    }
  })
);
