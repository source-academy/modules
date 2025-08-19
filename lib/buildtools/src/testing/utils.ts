import fs from 'fs/promises';
import pathlib from 'path';
import { gitRoot } from '@sourceacademy/modules-repotools/getGitRoot';
import { resolveSingleBundle, resolveSingleTab } from '@sourceacademy/modules-repotools/manifest';
import { baseVitestConfig, loadVitestConfigFromDir, sharedTabsConfig } from '@sourceacademy/modules-repotools/testing';
import type { ErrorResult } from '@sourceacademy/modules-repotools/types';
import { isNodeError, isSamePath, mapAsync } from '@sourceacademy/modules-repotools/utils';
import cloneDeep from 'lodash/cloneDeep.js';
import partition from 'lodash/partition.js';
import type { LabelColor } from 'vitest';
import { mergeConfig, type TestProjectInlineConfiguration } from 'vitest/config';

// Assign to each configuration a different colour :)
const colors: Readonly<LabelColor[]> = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

/**
 * If the vitest project has browser mode enabled, then remove the regular test project as that will run duplicate tests
 * Also, unless `watch` is true, the tests should be run in headless mode.
 */
export function setBrowserOptions(indivConfig: TestProjectInlineConfiguration, watch: boolean) {
  const nameStr = typeof indivConfig.test!.name === 'string' ? indivConfig.test!.name : indivConfig.test?.name?.label;

  if (indivConfig.test!.browser?.enabled) {
    indivConfig.test!.browser.headless = !watch;
    indivConfig.test!.browser.instances?.forEach(instance => {
      instance.name = `${nameStr} (${instance.browser})`;
      if (!instance.include) {
        instance.include = indivConfig.test!.include;
      }
    });
    indivConfig.test!.include = [];

    if (!indivConfig.optimizeDeps) {
      indivConfig.optimizeDeps = {};
    }

    if (indivConfig.optimizeDeps.include === undefined) {
      indivConfig.optimizeDeps.include = [];
    }

    indivConfig.optimizeDeps.include.push(...sharedTabsConfig.optimizeDeps.include);
  }
}

export type GetTestConfigurationResult = ErrorResult | {
  severity: 'success';
  config: TestProjectInlineConfiguration | null;
};

/**
 * For a given directory, recurse through it and determine if the given directory has any Vitest
 * test files within it
 */
export async function hasTests(directory: string) {
  try {
    // If the given folder has a vitest config, we assume the folder is
    // supposed to contain tests
    await fs.access(pathlib.join(directory, 'vitest.config.js'), fs.constants.R_OK);
    return true;
  } catch {}

  for await (const each of fs.glob(`${directory}/**/__tests__/**/*.{ts,tsx}`)) {
    return true;
  }

  return false;
}

/**
 * Based on a starting directory, locate the package.json that directory belongs to, then check
 * if a vitest config is present next to that package.json.
 * - The package.json refers to either a bundle or a tab, then
 *   - No config was found
 *     - return config: null if the bundle or tab has no tests
 *     - return the shared config if there are tests
 *   - If a config was found, then combine it with the shared configs and return
 * - The package.json refers to a regular package:
 *   - If there was no config found:
 *     - Throw an error if tests were found
 *     - Ignore if no tests were found
 *   - Merge the shared config with the loaded config and return
 */
export async function getTestConfiguration(directory: string, watch: boolean): Promise<GetTestConfigurationResult> {
  /**
   * Recurse upward from the current directory to find the nearest package json. If we're already at the git root
   * directory, throw an error.
   */
  async function findPackageJson(directory: string): Promise<['bundle' | 'tab' | 'config', string] | null> {
    if (isSamePath(directory, gitRoot)) return null;

    try {
      const jsonPath = pathlib.join(directory, 'package.json');
      const packageJson = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
      const match = /^@sourceacademy\/(bundle|tab)-.+$/u.exec(packageJson.name);

      if (!match) return ['config', directory];

      const [, typeStr] = match;
      const type = typeStr as 'bundle' | 'tab';
      return [type, directory];
    } catch (error) {
      if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
      const parentDir = pathlib.resolve(directory, '..');
      return findPackageJson(parentDir);
    }
  }

  const packageJsonResult = await findPackageJson(directory);
  if (packageJsonResult === null) {
    return {
      severity: 'success',
      config: null
    };
  }

  const [type, jsonDir] = packageJsonResult;
  let config = await loadVitestConfigFromDir(jsonDir);
  switch (type) {
    case 'config': {
      if (config === null) {
      // Not a bundle, no config
        if (await hasTests(jsonDir)) {
          return {
            severity: 'error',
            errors: [`Tests were found for ${directory}, but no vitest config could be located`]
          };
        }

        return {
          severity: 'success',
          config: null
        };
      } else {
        config = mergeConfig(baseVitestConfig, config);
      }

      if (config.test!.root === undefined) {
        config.test!.root = jsonDir;
      }

      if (config.test!.include === undefined) {
        config!.test!.include = ['**/__tests__/**/*.{ts,tsx}'];
      }

      break;
    }
    case 'tab': {
      const tab = await resolveSingleTab(jsonDir);
      if (!tab) {
        return {
          severity: 'error',
          errors: [`Invalid tab located at ${jsonDir}`]
        };
      }

      if (config === null) {
        if (!await hasTests(jsonDir)) {
          return {
            severity: 'success',
            config: null
          };
        }
        config = cloneDeep(sharedTabsConfig);
        config!.test!.name = `${tab.name} Tab`;
        config!.test!.root = jsonDir;
        config!.test!.include = ['**/__tests__/**/*.{ts,tsx}'];
      } else {
        config = mergeConfig(sharedTabsConfig, config);
      }
      break;
    }
    case 'bundle': {
      const bundleResult = await resolveSingleBundle(jsonDir);
      if (!bundleResult) {
        return {
          severity: 'error',
          errors: [`Invalid bundle present at ${jsonDir}`]
        };
      } else if (bundleResult.severity === 'error') {
        return bundleResult;
      }

      const { bundle } = bundleResult;
      if (config === null) {
        if (!await hasTests(jsonDir)) {
          return {
            severity: 'success',
            config: null
          };
        }

        config = cloneDeep(baseVitestConfig);
        config!.test!.name = `${bundle.name} Bundle`;
        config!.test!.root = jsonDir;
        config!.test!.include = ['**/__tests__/**/*.{ts,tsx}'];
      } else {
        config = mergeConfig(baseVitestConfig, config);
      }
      break;
    }
  }

  setBrowserOptions(config, watch);
  return {
    severity: 'success',
    config
  };

}

/**
 * Based on the root Vitest's configuration, get all the projects we need to test
 */
export async function getAllTestConfigurations(watch: boolean) {
  const rootConfig = await loadVitestConfigFromDir(gitRoot);
  if (!rootConfig?.test?.projects) return [];

  const [projectObjects, globPatterns] = partition(rootConfig.test.projects, each => typeof each !== 'string');

  const configs = await mapAsync(projectObjects, async each => {
    if (typeof each === 'object') {
      return each;
    } else {
      return each({ command: 'build', mode: '' });
    }
  });

  const filePatterns = new Set<string>();
  for (const globPath of globPatterns) {
    const fullGlobPath = pathlib.join(gitRoot, globPath);
    for await (const info of fs.glob(fullGlobPath, { withFileTypes: true })) {
      if (!info.isDirectory() || info.name === 'node_modules') continue;

      const fullPath = pathlib.join(info.parentPath, info.name);
      filePatterns.add(fullPath);
    }
  }

  await mapAsync([...filePatterns], async fullPath => {
    const result = await getTestConfiguration(fullPath, watch);
    if (result.severity === 'success' && result.config !== null) {
      configs.push(result.config);
    }
  });

  configs.forEach((config, i) => {
    const color = colors[i % colors.length];
    switch (typeof config.test!.name) {
      case 'string': {
        config.test!.name = {
          label: config.test!.name,
          color,
        };
        break;
      }
      case 'object': {
        if (config.test!.name !== null) {
          config.test!.name = {
            label: config.test!.name.label,
            color: config.test!.name.color ?? color
          };
        }
        break;
      }
    }
  });

  return configs;
}
