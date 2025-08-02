// Modules-lib test config
import react from '@vitejs/plugin-react';
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config.js';

export default mergeConfig(
  rootConfig,
  defineProject({
    optimizeDeps: {
      include: [
        '@blueprintjs/core',
        '@blueprintjs/icons',
        'lodash',
        'vitest-browser-react',
      ]
    },
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
