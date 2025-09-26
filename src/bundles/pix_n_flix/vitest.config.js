// @ts-check

import { defineProject } from 'vitest/config';

export default defineProject({
  optimizeDeps: {
    include: [
      'react',
      'vitest-browser-react'
    ]
  },
  test: {
    include: ['./src/**/__tests__/**/*.test.{ts,tsx}'],
    root: import.meta.dirname,
    name: 'pix_n_flix Bundle',
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [{
        browser: 'chromium',
      }]
    }
  }
});
