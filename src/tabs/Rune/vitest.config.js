// @ts-check
// Rune Tab vitest config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Rune Tab',
      environment: 'jsdom',
      include: [`${import.meta.dirname}/**/__tests__/*.{ts,tsx}`]
    }
  })
);
