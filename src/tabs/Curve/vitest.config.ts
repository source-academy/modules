// Curve Tab vitest.config
import { defineProject } from 'vitest/config';

export default defineProject({
  optimizeDeps: {
    include: [
      'js-slang/dist/utils/stringify',
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
