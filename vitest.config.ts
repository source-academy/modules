// Root vitest config
import { defineConfig } from 'vitest/config';

// TODO: Migrate this configuration to vitest 3.2 when it becomes stable
export default defineConfig({
  test: {
    workspace: [
      'lib/*/vitest.config.ts',
      './devserver/vite.config.ts',
      './src/bundles',
      './src/tabs'
    ]
  }
});
