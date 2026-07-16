import * as configs from './configs';
import defaultImportName from './rules/defaultImportName';
import noBarrelImports from './rules/noBarrelImports';
import regionComment from './rules/regionComment';
import tabType from './rules/tabType';
import instanceofCheck from './rules/typed/instanceofCheck';
import throwRuntimeError from './rules/typed/throwRuntimeError';

const plugin = {
  name: 'Source Academy Lint Plugin',
  rules: {
    'default-import-name': defaultImportName,
    'instanceof-check': instanceofCheck,
    'no-barrel-imports': noBarrelImports,
    'region-comment': regionComment,
    'tab-type': tabType,
    'throw-runtime-error': throwRuntimeError
  },
  configs: {
    'js/recommended': configs.jsConfig,
    'jsdoc/recommended': configs.jsdocConfig,
    'md/recommended': configs.markdownConfig,
    'style/recommended': configs.styleConfig,
    'ts/recommended': configs.tsConfig,
    'tsx/recommended': configs.tsxConfig,
    'vitest/recommended': configs.vitestConfig
  }
};

export default plugin;
