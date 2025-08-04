import type { ESLint, Rule } from 'eslint';
declare const plugin: {
  rules: {
    'tab-type': Rule.RuleModule
    'region-comment': Rule.RuleModule
  },
  configs: {
    'js/recommended': ESLint.ConfigData
    'ts/recommended': ESLint.ConfigData
    'tsx/recommended': ESLint.ConfigData
    'vitest/recommended': ESLint.ConfigData
  }
}

export default plugin;

