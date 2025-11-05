import { URL } from 'url';
import lintPlugin from '@sourceacademy/lint-plugin';
import type { Linter } from 'eslint';

/**
 * Represents the information about a single Rule
 */
interface RuleInfo {
  name: string;
  severity: Linter.StringSeverity;
  options?: unknown[];
  url?: string;
}

/**
 * Represents the information for a single configuration object
 */
interface SingleConfig {
  files: (string | string[])[];
  ignores?: string[];
  name: string;
  rules: RuleInfo[];
  plugins?: string[];
}

/**
 * Represents the information for a configuration object that consists
 * of multiple {@link SingleConfig} objects.
 */
interface ConfigInfo {
  name: string;
  configs: SingleConfig[];
}

/**
 * Convert the rule severity options into the string format
 */
function processRuleLevel(level: Linter.RuleSeverity): Linter.StringSeverity {
  if (typeof level === 'string') return level;

  switch (level) {
    case 0:
      return 'off';
    case 1:
      return 'warn';
    case 2:
      return 'error';
  }
}

/**
 * Find the actual URL to the rule given the plugin it came from
 */
function getRuleUrl(name: string): string | undefined {
  if (!name.includes('/')) {
    // If the name isn't scoped then its a "base-rule"
    return new URL(name, 'https://eslint.org/docs/latest/rules/').href;
  }

  const [scope, ruleName] = name.split('/', 2);

  // Unfortunately URLs are gonna have to be hardcoded
  switch (scope) {
    case 'jsdoc':
      return new URL(`${ruleName}.md`, 'https://github.com/gajus/eslint-plugin-jsdoc/tree/main/docs/rules/').href;
    case 'import':
      return new URL(`${ruleName}.md`, 'https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/').href;
    case 'markdown':
      return new URL(`${ruleName}.md`, 'https://github.com/eslint/markdown/tree/main/docs/rules/').href;
    case 'react':
      return new URL(`${ruleName}.md`, 'https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/').href;
    case '@sourceacademy':
      return `./2-rules.html#${ruleName}`;
    case '@stylistic':
      return new URL(ruleName, 'https://eslint.style/rules/').href;
    case '@typescript-eslint':
      return new URL(ruleName, 'https://typescript-eslint.io/rules/').href;
  }

  return undefined;
}

/**
 * Convert the ESLint object into the format required by the web page
 */
function processConfigObject(configKey: string, config: Linter.Config): SingleConfig {
  const info: SingleConfig = {
    files: typeof config.files === 'string' ? [config.files] : config.files,
    ignores: config.ignores,
    name: config.name ?? configKey,
    rules: [],
    plugins: !config.plugins
      ? undefined
      : Object.entries(config.plugins).map(([key, each]) => {
        if (each !== undefined) {
          if (each.meta?.name) return each.meta.name;
          if (each.name) return each.name;
        }
        return key;
      })
  };

  if (!config.rules) return info;

  for (const [ruleName, ruleOptions] of Object.entries(config.rules)) {
    if (!Array.isArray(ruleOptions)) {
      info.rules.push({
        name: ruleName,
        severity: processRuleLevel(ruleOptions),
        url: getRuleUrl(ruleName)
      });
    } else {
      const [ruleSeverity, ...otherOptions] = ruleOptions;
      info.rules.push({
        name: ruleName,
        severity: processRuleLevel(ruleSeverity),
        options: otherOptions,
        url: getRuleUrl(ruleName)
      });
    }
  }

  return info;
}

export default {
  load() {
    const processedConfigs = Object.entries(lintPlugin.configs).reduce<ConfigInfo[]>((res, [configKey, configObj]) => {
      if (Array.isArray(configObj)) {
        return [...res, {
          name: configKey,
          configs: configObj.map(each => processConfigObject(configKey, each))
        }];
      }

      return [
        ...res, {
          name: configKey,
          // @ts-expect-error This is going to complain because the config obj also needs to accept
          // legacy config objects, but we know we're not using any of those
          configs: [processConfigObject(configKey, configObj)]
        }
      ];
    }, []);

    return processedConfigs;
  }
};
