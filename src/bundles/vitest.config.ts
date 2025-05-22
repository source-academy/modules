import { defineProject } from 'vitest/config';

export default defineProject({
  resolve: {
    alias: [{
      find: /^js-slang\/context/,
      replacement: `${import.meta.dirname}/__mocks__/context.ts`
    }]
  },
  test: {
    name: 'Bundles',
    environment: 'jsdom',
    include: ['**/__tests__/**/*.ts']
  }
});
