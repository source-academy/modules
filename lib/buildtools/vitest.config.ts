// Buildtools Vitest config
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    clearMocks: true,
    environment: 'node',
    name: 'Build Tools',
    setupFiles: ['./vitest.setup.ts'],
  }
});
