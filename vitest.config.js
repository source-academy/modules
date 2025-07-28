// @ts-check
// Root vitest config
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      './devserver',
      './lib/*',
      './src/bundles/*',
      './src/tabs/*'
    ]
  }
});
