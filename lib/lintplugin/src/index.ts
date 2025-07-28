import type { ESLint } from 'eslint';
import * as configs from './configs';
import regionComment from './rules/regionComment';
import tabType from './rules/tabType';

const plugin: ESLint.Plugin = {
  name: 'Source Academy Lint Plugin',
  rules: {
    'tab-type': tabType,
    'region-comment': regionComment
  },
  configs: {
    'js/recommended': configs.jsConfig,
    'ts/recommended': configs.tsConfig,
    'tsx/recommended': configs.tsxConfig,
    'vitest/recommended': configs.vitestConfig
  }
};

export default plugin;
