// Markdown-Tree plugin vitest
// @ts-check

import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      root: import.meta.dirname,
      name: 'Markdown Tree Plugin',
      include: ['src/**/__tests__/*.test.ts']
    }
  })
);
