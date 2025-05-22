// Lint Plugin vitest setup
import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'Lint Plugin',
    environment: 'node',

    // Required because the ESLint rule tester tries to use the test helpers from
    // the global scope
    globals: true
  }
});
