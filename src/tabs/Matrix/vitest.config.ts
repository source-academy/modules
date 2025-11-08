// Matrix Tab Vitest Config
import { defineProject } from 'vitest/config';

export default defineProject({
  optimizeDeps: {
    include: ['lodash/range']
  },
  test: {
    root: import.meta.dirname,
    name: 'Matrix Tab',
    browser: {
      enabled: true,
    }
  }
});
