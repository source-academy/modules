import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: `${import.meta.dirname}/../bundles/__mocks__/context.ts`
    }]
  },
  test: {
    name: 'Tabs',
    environment: 'jsdom',
    include: [
      '**/__tests__/**/*.{ts,tsx}',
    ]
  }
});
