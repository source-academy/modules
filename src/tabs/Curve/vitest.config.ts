// Curve Tab vitest.config
import pathlib from 'path';
import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: pathlib.join(import.meta.dirname, '../../__mocks__/context.ts')
    }]
  },
  optimizeDeps: {
    include: [
      'js-slang',
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
