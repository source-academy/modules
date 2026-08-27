// Buildtools Vitest config
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    root: import.meta.dirname,
    clearMocks: true,
    environment: 'node',
    name: 'Typedoc Plugin',
    include: ['**/__tests__/**/*.test.ts']
  }
});
