// Modules-lib test config
import react from '@vitejs/plugin-react';
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    plugins: [react()],
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
