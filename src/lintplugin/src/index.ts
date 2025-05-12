import type { ESLint } from 'eslint';
import collateTypeImports from './rules/typeimports';

const plugin: ESLint.Plugin = {
  name: 'Source Academy Lint Plugin',
  rules: {
    'collate-type-imports': collateTypeImports
  }
};

export default plugin;
