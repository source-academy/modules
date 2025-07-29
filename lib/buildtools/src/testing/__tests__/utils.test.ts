import type { Dirent } from 'fs';
import fs from 'fs/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TestProjectInlineConfiguration } from 'vitest/config.js';
import * as manifest from '../../build/manifest.js';
import type { ResolvedBundle, ResolvedTab } from '../../types.js';
import * as configs from '../configs.js';
import * as utils from '../utils.js';

vi.mock(import('../../getGitRoot.js'));

const mockedFsGlob = vi.spyOn(fs, 'glob');
function mockHasTestsOnce(retValue: boolean) {
  mockedFsGlob.mockImplementationOnce(retValue ? async function* () {
    yield Promise.resolve('');
  // eslint-disable-next-line require-yield, @typescript-eslint/require-await
  } : async function* () {
    return;
  });
}

const mockedFsAccess = vi.spyOn(fs, 'access').mockRejectedValue(new Error());
const mockedLoadConfig = vi.spyOn(configs, 'loadVitestConfigFromDir');
const mockedResolver = vi.spyOn(manifest, 'resolveEitherBundleOrTab');

describe('Test hasTests', () => {
  it('Returns true when there are files that match the glob', async () => {
    mockHasTestsOnce(true);

    await expect(utils.hasTests('')).resolves.toEqual(true);
    expect(fs.access).toHaveBeenCalledOnce();
    expect(fs.glob).toHaveBeenCalledOnce();
  });

  it('Returns false when there are no files that match the glob', async () => {
    mockHasTestsOnce(false);

    await expect(utils.hasTests('')).resolves.toEqual(false);
    expect(fs.access).toHaveBeenCalledOnce();
    expect(fs.glob).toHaveBeenCalledOnce();
  });

  it('Returns true if there is a vitest config', async () => {
    mockedFsAccess.mockResolvedValueOnce();

    await expect(utils.hasTests('')).resolves.toEqual(true);
    expect(fs.access).toHaveBeenCalledOnce();
    expect(fs.glob).not.toHaveBeenCalled();
  });
});

describe('Test setBrowserOptions', () => {
  const mockBundle: ResolvedBundle = {
    name: 'yo',
    manifest: {},
    directory: '',
    type: 'bundle'
  };

  it('Should do nothing if browser mode is not enabled', () => {
    const mockedConfig: TestProjectInlineConfiguration = {
      test: {
        name: 'yo'
      }
    };

    utils.setBrowserOptions(mockedConfig, mockBundle, false);
    expect(mockedConfig).toMatchObject({});
  });

  it('Should move name and include onto the browser instance if browser mode is enabled', () => {
    const mockedConfig: TestProjectInlineConfiguration = {
      test: {
        name: 'yo',
        include: ['files'],
        browser: {
          enabled: true,
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    };

    utils.setBrowserOptions(mockedConfig, mockBundle, false);
    expect(mockedConfig).toMatchObject({
      test: {
        include: [],
        name: 'yo',
        browser: {
          enabled: true,
          instances: [{
            browser: 'chromium',
            name: 'yo (chromium)',
            include: ['files']
          }]
        }
      }
    });
  });

  it('Should set headless to false when watch is true', () => {
    const mockedConfig: TestProjectInlineConfiguration = {
      test: {
        name: 'yo',
        include: ['files'],
        browser: {
          enabled: true,
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    };

    utils.setBrowserOptions(mockedConfig, mockBundle, true);
    expect(mockedConfig).toMatchObject({
      test: {
        include: [],
        name: 'yo',
        browser: {
          enabled: true,
          headless: false,
          instances: [{
            browser: 'chromium',
            name: 'yo (chromium)',
            include: ['files']
          }]
        }
      }
    });
  });
});

describe('Test getBundleOrTabConfiguration', () => {
  const mockBundle: ResolvedBundle = {
    name: 'test_bundle',
    manifest: {},
    directory: '/test_bundle',
    type: 'bundle'
  };

  it('should return the exact config if the config is present and has a test object (for bundles)', async () => {
    mockedLoadConfig.mockResolvedValueOnce({
      test: {
        name: 'test',
      }
    });

    await expect(utils.getBundleOrTabTestConfiguration(mockBundle, false)).resolves.toMatchObject({
      ...configs.sharedVitestConfiguration,
      test: {
        ...configs.sharedVitestConfiguration.test!,
        name: 'test'
      }
    });
    expect(configs.loadVitestConfigFromDir).toHaveBeenCalledOnce();
  });

  it('should return the exact config if the config is present and has a test object (for tabs)', async () => {
    const mockTab: ResolvedTab = {
      type: 'tab',
      name: 'Tab0',
      directory: '',
      entryPoint: ''
    };

    mockedLoadConfig.mockResolvedValueOnce({
      test: {
        name: 'test',
      }
    });

    await expect(utils.getBundleOrTabTestConfiguration(mockTab, false)).resolves.toMatchObject({
      ...configs.sharedTabsConfig,
      test: {
        ...configs.sharedTabsConfig.test!,
        name: 'test'
      }
    });
    expect(configs.loadVitestConfigFromDir).toHaveBeenCalledOnce();
  });

  it('should set the name for the test if the config did not contain one', async () => {
    mockedLoadConfig.mockResolvedValueOnce({
      test: {}
    });

    await expect(utils.getBundleOrTabTestConfiguration(mockBundle, false)).resolves.toMatchObject({
      ...configs.sharedVitestConfiguration,
      test: {
        ...configs.sharedVitestConfiguration.test!,
        name: 'test_bundle Bundle'
      }
    });
    expect(configs.loadVitestConfigFromDir).toHaveBeenCalledOnce();
  });

  it('should populate the test configuration if the bundle has none', async () => {
    mockedLoadConfig.mockResolvedValueOnce(null);

    await expect(utils.getBundleOrTabTestConfiguration(mockBundle, false)).resolves.toMatchObject({
      ...configs.sharedVitestConfiguration,
      test: {
        ...configs.sharedVitestConfiguration.test!,
        name: 'test_bundle Bundle',
        include: ['**/__tests__/**/*.{ts,tsx}'],
        root: '/test_bundle',
      }
    });
    expect(configs.loadVitestConfigFromDir).toHaveBeenCalledOnce();
  });
});

describe('Test getTestConfiguration', () => {

  describe('With tabs', () => {
    beforeEach(() => {
      mockedResolver.mockResolvedValueOnce({
        severity: 'success',
        asset: {
          type: 'tab',
          name: 'Tab0',
          directory: '/Tab0',
          entryPoint: '/Tab0/index.tsx'
        }
      });
    });

    it('Should return the config if the tab has tests', async () => {
      mockHasTestsOnce(true);
      await expect(utils.getTestConfiguration('', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedTabsConfig,
          test: {
            ...configs.sharedTabsConfig.test!,
            name: 'Tab0 Tab',
            root: '/Tab0'
          }
        }
      });
    });

    it('Should return null if the tab has no tests', async () => {
      mockHasTestsOnce(false);
      await expect(utils.getTestConfiguration('', false)).resolves.toMatchObject({
        severity: 'success',
        config: null
      });
    });
  });

  describe('With bundles', () => {
    beforeEach(() => {
      mockedResolver.mockResolvedValueOnce({
        severity: 'success',
        asset: {
          type: 'bundle',
          name: 'bundle0',
          manifest: {},
          directory: '/bundle0',
        }
      });
    });

    it('Should return the config if the bundle has tests', async () => {
      mockHasTestsOnce(true);
      await expect(utils.getTestConfiguration('', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedVitestConfiguration,
          test: {
            ...configs.sharedVitestConfiguration.test!,
            name: 'bundle0 Bundle',
            root: '/bundle0'
          }
        }
      });
    });

    it('Should return null if the bundle has no tests', async () => {
      mockHasTestsOnce(false);
      await expect(utils.getTestConfiguration('', false)).resolves.toMatchObject({
        severity: 'success',
        config: null
      });
    });
  });

  describe('With neither', () => {
    beforeEach(() => {
      mockedResolver.mockResolvedValueOnce({
        severity: 'error',
        errors: []
      });
      mockedFsGlob.mockReset();
    });

    it('should return the config if the directory has tests', async () => {
      mockHasTestsOnce(true);
      mockedLoadConfig.mockResolvedValueOnce({
        test: {
          name: 'Test0'
        }
      });

      await expect(utils.getTestConfiguration('/dir', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedVitestConfiguration,
          test: {
            ...configs.sharedVitestConfiguration.test!,
            name: 'Test0',
            root: '/dir'
          }
        }
      });
    });

    it('should return an error if the directory doesn\'t have a vitest config but has tests', async () => {
      mockedLoadConfig.mockResolvedValueOnce(null);
      mockHasTestsOnce(true);

      await expect(utils.getTestConfiguration('/dir', false))
        .resolves
        .toMatchObject({
          severity: 'error',
          errors: ['Tests were found at /dir, but no vitest config was found']
        });
    });

    it('should not return an error if the directory has no vitest config or tests', async () => {
      mockedLoadConfig.mockResolvedValueOnce(null);
      mockHasTestsOnce(false);

      await expect(utils.getTestConfiguration('/dir', false))
        .resolves
        .toMatchObject({
          severity: 'success',
          config: null
        });
    });
  });
});

describe('Test getAllTestConfigurations', () => {
  it('returns an empty array if there are no projects defined', async () => {
    mockedLoadConfig.mockResolvedValueOnce({
      test: {
        projects: []
      }
    });

    await expect(utils.getAllTestConfigurations(false)).resolves.toEqual([]);
  });

  it('correctly handles non string project specifications', async () => {
    const mockProjectFn0 = vi.fn().mockReturnValue({
      test: {
        name: 'project0'
      }
    });
    const mockProjectFn1 = vi.fn().mockResolvedValue({
      test: {
        name: 'project1'
      }
    });

    mockedLoadConfig.mockResolvedValueOnce({
      test: {
        projects: [
          mockProjectFn0,
          mockProjectFn1,
          Promise.resolve({
            test: {
              name: {
                label: 'project2',
                color: 'black'
              }
            }
          })
        ]
      }
    });

    const result = await utils.getAllTestConfigurations(false);
    expect(result.length).toEqual(3);
    expect(result[0]).toMatchObject({
      test: {
        name: {
          label: 'project0',
          color: 'black'
        }
      }
    });

    expect(result[1]).toMatchObject({
      test: {
        name: {
          label: 'project1',
          color: 'red'
        }
      }
    });
    // Verify that if a non text name was given it is used as is
    expect(result[2]).toMatchObject({
      test: {
        name: {
          label: 'project2',
          color: 'black'
        }
      }
    });
  });

  it('handles globs correctly', async () => {
    // Force everything to be resolved as neither a tab nor a bundle
    mockedResolver.mockResolvedValue({
      severity: 'error',
      errors: []
    });

    // Once for the root config
    mockedLoadConfig.mockResolvedValueOnce({
      test: {
        projects: ['project0', 'project1', 'project2']
      }
    })
    // Then once more for each of the child projects
      .mockResolvedValueOnce({ test: { name: 'project0' } })
      .mockResolvedValueOnce({
        test: {
          name: {
            label: 'project1'
          }
        }
      })
      .mockResolvedValueOnce({
        test: {
          name: {
            label: 'project2',
            color: 'black'
          }
        }
      });

    // eslint-disable-next-line @typescript-eslint/require-await
    mockedFsGlob.mockImplementationOnce(async function* () {
      // A glob might return the same path multiple times,
      // so we need to check we handled each path only once
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          yield {
            isDirectory: () => true,
            name: `project${i}`,
            parentPath: '/'
          } as Dirent;
        }
      }

      yield {
        isDirectory: () => true,
        name: 'node_modules',
        parentPath: '/'
      } as Dirent;
    });

    const results = await utils.getAllTestConfigurations(false);
    expect(results.length).toEqual(3);
    expect(configs.loadVitestConfigFromDir).toHaveBeenCalledTimes(4);
    expect(results).toContainEqual({
      ...configs.sharedVitestConfiguration,
      test: {
        ...configs.sharedVitestConfiguration.test!,
        root: '/project0',
        name: {
          label: 'project0',
          color: 'black'
        }
      }
    });
    expect(results).toContainEqual({
      ...configs.sharedVitestConfiguration,
      test: {
        ...configs.sharedVitestConfiguration.test!,
        root: '/project1',
        name: {
          label: 'project1',
          color: 'red'
        }
      }
    });
    expect(results).toContainEqual({
      ...configs.sharedVitestConfiguration,
      test: {
        ...configs.sharedVitestConfiguration.test!,
        root: '/project2',
        name: {
          label: 'project2',
          color: 'black'
        }
      }
    });
  });
});
