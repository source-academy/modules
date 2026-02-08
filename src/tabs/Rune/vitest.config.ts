// Rune Tab vitest.config.js
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
      'lodash/clamp',
      'js-slang',
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
