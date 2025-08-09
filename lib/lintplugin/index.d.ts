import type { ESLint, Rule } from 'eslint';
declare const plugin: {
  rules: {
    'default-import-name': Rule.RuleModule
    'no-barrel-imports': Rule.RuleModule
    'region-comment': Rule.RuleModule
    'tab-type': Rule.RuleModule
  },
  configs: {
    'js/recommended': ESLint.ConfigData
    'ts/recommended': ESLint.ConfigData
    'tsx/recommended': ESLint.ConfigData
    'vitest/recommended': ESLint.ConfigData
  }
}

export default plugin;

