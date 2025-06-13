// Bundles vitest config

import { defineProject, mergeConfig } from 'vitest/config';
import rootConfig from '../../vitest.config';

export default mergeConfig(
  rootConfig,
  defineProject({
    test: {
      name: 'Bundles',
      environment: 'jsdom',
      include: [`${import.meta.dirname}/**/__tests__/*.ts`]
    }
  })
);
