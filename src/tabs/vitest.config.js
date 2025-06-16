// @ts-check
// Tabs vitest config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Tabs',
      environment: 'jsdom',
      include: [`${import.meta.dirname}/**/__tests__/*.{ts,tsx}`]
    }
  })
);
