import type { ESLint } from 'eslint';
import * as configs from './configs';
import tabType from './rules/tabType';
import collateTypeImports from './rules/typeimports';

const plugin: ESLint.Plugin = {
  name: 'Source Academy Lint Plugin',
  rules: {
    // @ts-expect-error typescript-eslint rules are typed differently
    'collate-type-imports': collateTypeImports,
    'tab-type': tabType
  },
  configs: {
    'js/recommended': configs.jsConfig,
    'ts/recommended': configs.tsConfig,
    'tsx/recommended': configs.tsxConfig,
    'vitest/recommended': configs.vitestConfig
  }
};

export default plugin;
