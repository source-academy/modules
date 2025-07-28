import fs from 'fs/promises';
import pathlib from 'path';
import capitalize from 'lodash/capitalize.js';
import cloneDeep from 'lodash/cloneDeep.js';
import partition from 'lodash/partition.js';
import { loadConfigFromFile } from 'vite';
import type { LabelColor } from 'vitest';
import { mergeConfig, type TestProjectInlineConfiguration } from 'vitest/config';
import { resolveEitherBundleOrTab } from '../build/manifest.js';
import { getGitRoot } from '../getGitRoot.js';
import type { ErrorResult, ResolvedBundle, ResolvedTab } from '../types.js';
import { mapAsync } from '../utils.js';
import { sharedTabsConfig, sharedVitestConfiguration } from './configs.js';

/**
 * For a given directory, recurse through it and determine if the given directory has any Vitest
 * test files within it
 */
export async function hasTests(directory: string) {
  try {
    // If the given folder has a vitest config, we assume the folder is
    // supposed to contain tests
    await fs.access(`${directory}/vitest.config.js`, fs.constants.R_OK);
    return true;
  } catch {}

  async function* findFile(directory: string): AsyncGenerator<boolean> {
    const contents = await fs.readdir(directory, { withFileTypes: true });
    for (const each of contents) {
      if (each.isFile()) {
        const ext = pathlib.extname(each.name);
        if (ext === '.ts' || ext === '.tsx') {
          yield true;
          return;
        }
      } else if (each.isDirectory()) {
        const fullPath = pathlib.join(directory, each.name);
        yield* findFile(fullPath);
      }
    }
  }

  async function* findTestDirectory(directory: string): AsyncGenerator<boolean> {
    const contents = await fs.readdir(directory, { withFileTypes: true });
    for (const each of contents) {
      const fullPath = pathlib.join(directory, each.name);
      if (!each.isDirectory()) continue;

      if (each.name === '__tests__') {
        yield* findFile(directory);
      }
      yield* findTestDirectory(fullPath);
    }
  }

  for await (const each of findTestDirectory(directory)) {
    if (each) return true;
  }
  return false;
  // return findTestDirectory(directory);
}

/**
 * Try to load the `vitest.config.js` from the given
 * directory. If it doesn't exist, then return `null`.
 */
async function loadVitestConfigFromDir(directory: string) {
  const filesToTry = [
    'vitest.config.js',
    'vite.config.ts'
  ];

  for (const fileToTry of filesToTry) {
    try {
      const fullPath = pathlib.join(directory, fileToTry);
      await fs.access(fullPath, fs.constants.R_OK);
      const config = await loadConfigFromFile(
        { command: 'build', mode: '' },
        fullPath,
        undefined,
        'silent',
      );

      if (config !== null) return config.config as TestProjectInlineConfiguration;
    } catch {}
  }
  return null;
}

/**
 * If the vitest project has browser mode enabled, then remove the regular test project as that will run duplicate tests
 * Also, unless `watch` is true, the tests should be run in headless mode.
 */
function setBrowserOptions(indivConfig: TestProjectInlineConfiguration, asset: ResolvedTab | ResolvedBundle, watch: boolean) {
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
  }
}

/**
 * Load the Vitest configuration for a given tab or bundle. If the tab or bundle defines its own `vitest.config.js`,
 * then it is merged with the default options for tabs and bundles respectively. Otherwise, those default options
 * will be used wholesale.
 */
async function getBundleOrTabTestConfiguration(asset: ResolvedTab | ResolvedBundle, watch: boolean) {
  let indivConfig = await loadVitestConfigFromDir(asset.directory);
  if (indivConfig !== null && indivConfig.test) {
    if (!indivConfig.test.name) {
      indivConfig.test.name = `${capitalize(asset.name)} ${capitalize(asset.type)}`;
    }

    if (asset.type === 'tab') {
      indivConfig = mergeConfig(sharedTabsConfig, indivConfig);
    } else {
      indivConfig = mergeConfig(sharedVitestConfiguration, indivConfig);
    }

    setBrowserOptions(indivConfig, asset, watch);
    return indivConfig;
  }

  if (asset.type === 'tab') {
    indivConfig = cloneDeep(sharedTabsConfig);
  } else {
    indivConfig = cloneDeep(sharedVitestConfiguration);
  }

  indivConfig!.test!.name = `${capitalize(asset.name)} ${capitalize(asset.type)}`;
  indivConfig!.test!.root = asset.directory;
  indivConfig!.test!.include = ['**/__tests__/**/*.{ts,tsx}'];

  setBrowserOptions(indivConfig!, asset, watch);
  return indivConfig;
}

type GetTestConfigurationResult = ErrorResult | {
  severity: 'success'
  config: TestProjectInlineConfiguration | null
};

/**
 * Load `vitest.config.js` from the given directory. This should not be used with a directory
 * that contains a bundle or a tab
 */
export async function getTestConfiguration(directory: string, watch: boolean): Promise<GetTestConfigurationResult> {
  const resolveResult = await resolveEitherBundleOrTab(directory);
  if (resolveResult.severity === 'success') {
    const { asset } = resolveResult;

    if (!await hasTests(asset.directory)) {
      return {
        severity: 'success',
        config: null
      };
    }

    const config = await getBundleOrTabTestConfiguration(asset, watch);
    return {
      severity: 'success',
      config
    };
  }

  if (resolveResult.errors.length > 0) {
    return resolveResult;
  }

  const indivConfig = await loadVitestConfigFromDir(directory);
  if (indivConfig === null || !indivConfig.test) {
    if (await hasTests(directory)) {
      return {
        severity: 'error',
        errors: [`Tests were found at ${directory}, but no vitest config was found`]
      };
    }
    return {
      severity: 'success',
      config: null
    };
  }

  if (indivConfig.test.browser?.enabled) {
    indivConfig!.test.browser.headless = !watch;
  }

  if (!indivConfig.test.root) {
    indivConfig.test.root = directory;
  }

  return {
    severity: 'success',
    config: mergeConfig(sharedVitestConfiguration, indivConfig!)
  };
}

/**
 * Based on the root Vitest's configuration, get all the projects we need to test
 */
export async function getAllTestConfigurations(watch: boolean) {
  const gitRoot = await getGitRoot();
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

  // Assign each configuration a different colour :)
  const colors: LabelColor[] = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
  configs.forEach((config, i) => {
    if (typeof config.test!.name === 'string') {
      config.test!.name = {
        label: config.test!.name,
        color: colors[i % colors.length]
      };
    }
  });

  return configs;
}
