// @ts-check
// Actions Vitest config

import { baseVitestConfig } from '@sourceacademy/modules-repotools/testing';
import { defineProject, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseVitestConfig,
  defineProject({
    test: {
      name: 'Github Actions',
      root: import.meta.dirname,
      include: ['./src/**/__tests__/*.test.ts'],
      setupFiles: ['vitest.setup.ts'],
    },
  })
);
