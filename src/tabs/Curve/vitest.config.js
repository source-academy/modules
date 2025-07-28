// @ts-check
// Curve Tab vitest.config.js
import { defineProject } from 'vitest/config';

export default defineProject({
  optimizeDeps: {
    include: [
      'js-slang/dist/utils/stringify',
      'lodash/clamp',
    ]
  },
  test: {
    root: import.meta.dirname,
    name: 'Curve Tab',
    browser: {
      enabled: true,
    }
  }
});
