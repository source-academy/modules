import fs from 'fs/promises';
import pathlib from 'path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import cloneDeep from 'lodash/cloneDeep.js';
import partition from 'lodash/partition.js';
import { loadConfigFromFile } from 'vite';
import type { LabelColor } from 'vitest';
import { defineProject, mergeConfig, type TestProjectInlineConfiguration, type ViteUserConfig } from 'vitest/config';
import type { BrowserConfigOptions, ProjectConfig } from 'vitest/node';
import { gitRoot, rootVitestConfigPath } from '../getGitRoot.js';
import { resolveSingleBundle, resolveSingleTab } from '../manifest.js';
import type { ErrorResult } from '../types.js';
import { isNodeError, isSamePath, mapAsync } from '../utils.js';
import loadVitestConfigFromDir from './loader.js';
import { isTestDirectory, testIncludePattern } from './testUtils.js';

/**
 * Type wrapper around {@link TestProjectInlineConfiguration} to make some properties mandatory
 * to reduce the number of non-null assertions we need to make
 */
type TestProjectInlineConfigurationWithBrowser = Omit<TestProjectInlineConfiguration, 'test'> & {
  test: Omit<ProjectConfig, 'browser'> & {
    browser: BrowserConfigOptions;
  };
};

const colors: Readonly<LabelColor[]> = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

/**
 * Loads the root Vitest config
 */
async function loadRootConfig() {
  const loadResult = await loadConfigFromFile(
    { command: 'build', mode: '' },
    rootVitestConfigPath,
    undefined,
    'silent',
  );

  if (loadResult === null) {
    throw new Error('Failed to load root vitest configuration!');
  }

  const config = loadResult.config;

  config.test!.projects = undefined;
  config.test!.environment = 'jsdom';

  return config;
}

/**
 * A shared Vitest configuration object that can be combined with {@link mergeConfig}
 * to create custom Vitest configurations for each sub project
 */
export const baseVitestConfig: ViteUserConfig = await loadRootConfig();

/**
 * Default browser mode options
 */
export const browserModeConfig: BrowserConfigOptions = {
  /*
   * Instances should not be set here because if the config to merge
   * also contains an instances configuration the instance configured here
   * gets added instead of being replaced, resulting in an erroneous extra
   * instance configuration.
   */
  provider: playwright(),
};

/**
 * Vitest configuration specific to tabs
 */
export const sharedTabsConfig = mergeConfig(
  baseVitestConfig,
  defineProject({
    plugins: [react()],
    optimizeDeps: {
      include: [
        '@blueprintjs/core',
        '@blueprintjs/icons',
        'gl-matrix',
        'js-slang',
        'lodash',
        'vitest-browser-react'
      ]
    },
    test: {
      environment: 'jsdom',
    }
  })
);

/**
 * Computes the browser mode configuration for the given Vitest configuration and returns the updated
 * config.\
 * If the vitest project has browser mode enabled, then remove the regular test project as that will run duplicate tests.\
 * Also, unless `watch` is true, the tests are run in headless mode.
 */
export function setBrowserOptions(indivConfig: TestProjectInlineConfiguration, watch: boolean): TestProjectInlineConfiguration {
  if (!indivConfig.test!.browser || !indivConfig.test!.browser.enabled) return indivConfig;

  const nameStr = typeof indivConfig.test!.name === 'string' ? indivConfig.test!.name : indivConfig.test?.name?.label;

  const combinedConfig = mergeConfig({
    test: {
      browser: browserModeConfig
    }
  }, indivConfig) as TestProjectInlineConfigurationWithBrowser;

  combinedConfig.test.browser.headless = !watch;

  // If there are no browser instances, add 1 chromium instance
  if (!combinedConfig.test.browser.instances) {
    combinedConfig.test.browser.instances = [{
      browser: 'chromium'
    }];
  }

  combinedConfig.test.browser.instances.forEach(instance => {
    if (!instance.name) {
      instance.name = `${nameStr} (${instance.browser})`;
    }

    if (!instance.include) {
      instance.include = combinedConfig.test.include;
    }
  });

  combinedConfig.test.include = [];
  return combinedConfig;
}

export type GetTestConfigurationResult = ErrorResult | {
  severity: 'success';
  config: TestProjectInlineConfiguration | null;
};

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
        if (await isTestDirectory(jsonDir)) {
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
        config = mergeConfig(cloneDeep(baseVitestConfig), config);
      }

      if (config.test!.root === undefined) {
        config.test!.root = jsonDir;
      }

      if (config.test!.include === undefined) {
        config.test!.include = [testIncludePattern];
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
        if (!await isTestDirectory(jsonDir)) {
          return {
            severity: 'success',
            config: null
          };
        }
        config = cloneDeep(sharedTabsConfig);
        config.test!.name = `${tab.name} Tab`;
        config.test!.root = jsonDir;
        config.test!.include = [testIncludePattern];
      } else {
        config = mergeConfig(cloneDeep(sharedTabsConfig), config);
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
        if (!await isTestDirectory(jsonDir)) {
          return {
            severity: 'success',
            config: null
          };
        }

        config = cloneDeep(baseVitestConfig);
        config.test!.name = `${bundle.name} Bundle`;
        config.test!.root = jsonDir;
        config.test!.include = [testIncludePattern];
      } else {
        config = mergeConfig(cloneDeep(baseVitestConfig), config);
      }
      break;
    }
  }

  const finalConfig = setBrowserOptions(config, watch);

  return {
    severity: 'success',
    config: finalConfig
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
      if (
        !info.isDirectory()
        || info.name === 'node_modules'
        || info.name.startsWith('__')
      ) continue;

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

export { loadVitestConfigFromDir, testIncludePattern };
