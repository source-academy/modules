import type { ESLint } from 'eslint';
import * as configs from './configs';
import defaultImportName from './rules/defaultImportName';
import noBarrelImports from './rules/noBarrelImports';
import regionComment from './rules/regionComment';
import tabType from './rules/tabType';

const plugin: ESLint.Plugin = {
  name: 'Source Academy Lint Plugin',
  rules: {
    'default-import-name': defaultImportName,
    // @ts-expect-error Typescript-Eslint rules are just built different
    'no-barrel-imports': noBarrelImports,
    'region-comment': regionComment,
    'tab-type': tabType,
  },
  configs: {
    'js/recommended': configs.jsConfig,
    'jsdoc/recommended': configs.jsdocConfig,
    'md/recommended': configs.markdownConfig,
    'style/recommended': configs.styleConfig,
    // @ts-expect-error ESLint and Typescript-ESLint types don't always agree
    'ts/recommended': configs.tsConfig,
    'tsx/recommended': configs.tsxConfig,
    'vitest/recommended': configs.vitestConfig
  }
};

export default plugin;
