// @ts-check
// Modules-lib test config
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Modules Library',
      include: [`${import.meta.dirname}/**/__tests__/*.test.{ts,tsx}`],
      environment: 'jsdom',
      browser: {
        enabled: true,
        // headless: true,
        provider: 'playwright',
        instances: [{
          browser: 'chromium',
        }]
      }
    }
  })
);
