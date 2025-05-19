import type { ESLint } from 'eslint';
import collateTypeImports from './rules/typeimports.js';
import { jsConfig, tsConfig } from './configs.js';
import moduleTagPresent from './rules/moduleTag.js';

const plugin: ESLint.Plugin = {
  name: 'Source Academy Lint Plugin',
  rules: {
    'collate-type-imports': collateTypeImports,
    'module-tag-present': moduleTagPresent
  },
  configs: {
    js: jsConfig,
    ts: tsConfig
  }
}

export default plugin;
