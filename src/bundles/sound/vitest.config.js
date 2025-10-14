// @ts-check

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'sound Bundle',
    include: ['./src/**/__tests__/**/*.test.{ts,tsx}'],
    root: import.meta.dirname,
    browser: {
      enabled: false,
    }
  }
});
