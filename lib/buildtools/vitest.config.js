// @ts-check
// Buildtools Vitest config
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    root: import.meta.dirname,
    clearMocks: true,
    environment: 'node',
    name: 'Build Tools',
    setupFiles: ['vitest.setup.ts'],
    include: ['**/__tests__/*.test.ts'],
    exclude: ['**/__test_mocks__/**']
  }
});
