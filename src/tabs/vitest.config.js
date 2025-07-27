// @ts-check
// Tabs vitest config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      include: [],
      environment: 'jsdom',
      browser: {
        enabled: true,
        provider: 'playwright',
        instances: [{
          headless: true,
          name: 'Tabs',
          browser: 'chromium',
          include: [`${import.meta.dirname}/**/__tests__/*.{ts,tsx}`]
        }]
      }
    }
  })
);
