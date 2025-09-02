// @ts-check
// Rune Tab vitest.config.js
import { defineProject } from 'vitest/config';

export default defineProject({
  optimizeDeps: {
    include: [
      'lodash/clamp',
      'js-slang/dist/utils/stringify'
    ]
  },
  test: {
    root: import.meta.dirname,
    name: 'Rune Tab',
    browser: {
      enabled: true,
    }
  }
});
