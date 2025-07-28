// Markdown-Tree plugin vitest
// @ts-check

import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Markdown Tree Plugin',
      include: [`${import.meta.dirname}/src/**/__tests__/*.test.ts`]
    }
  })
);
