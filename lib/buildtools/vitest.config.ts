// Buildtools Vitest config
import { resolve } from 'path';
import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      alias: {
        // necessary because the sample bundle tsconfig is loaded via a dynamic import that's supposed to be relative to the
        // bin file and not the source file
        [resolve(import.meta.dirname, 'src/templates/templates/bundle_tsconfig.json')]: resolve(import.meta.dirname, 'bin/templates/bundle_tsconfig.json')
      },
      clearMocks: true,
      environment: 'node',
      name: 'Build Tools',
      setupFiles: ['./vitest.setup.ts'],
    }
  })
);
