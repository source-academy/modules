import type { ESLint } from 'eslint';
import { jsConfig, tsConfig } from './configs';
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
    js: jsConfig,
    // @ts-expect-error tseslint doesn't play nice with eslint's typing
    ts: tsConfig
  }
};

export default plugin;
