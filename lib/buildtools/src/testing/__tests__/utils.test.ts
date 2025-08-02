import type { Dirent } from 'fs';
import fs from 'fs/promises';
import * as manifest from '@sourceacademy/modules-repotools/manifest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TestProjectInlineConfiguration } from 'vitest/config';
import * as configs from '../configs.js';
import * as utils from '../utils.js';

class ENOENT extends Error {
  public get code() {
    return 'ENOENT';
  }
}

// @ts-expect-error These mock implementations don't also include the types
// for the memoization done by lodash
vi.mock(import('../../getGitRoot.js'), () => ({
  getGitRoot: () => Promise.resolve('/'),
  getBundlesDir: () => Promise.resolve('/bundles'),
  getTabsDir: () => Promise.resolve('/tabs'),
  getOutDir: () => Promise.resolve('/out')
}));

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
const mockedReadFile = vi.spyOn(fs, 'readFile');
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
  it('Should do nothing if browser mode is not enabled', () => {
    const mockedConfig: TestProjectInlineConfiguration = {
      test: {
        name: 'yo'
      }
    };

    utils.setBrowserOptions(mockedConfig, false);
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

    utils.setBrowserOptions(mockedConfig, false);
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

    utils.setBrowserOptions(mockedConfig, true);
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

describe('Test getTestConfiguration', () => {
  describe('With tabs', () => {
    beforeEach(() => {
      mockedReadFile.mockImplementation(p => {
        if (p === '/tabs/Tab0/package.json') {
          return Promise.resolve(JSON.stringify({
            name: '@sourceacademy/tab-Tab0'
          }));
        }

        throw new ENOENT();
      });

      vi.spyOn(manifest, 'resolveSingleTab').mockResolvedValueOnce({
        type: 'tab',
        name: 'Tab0',
        directory: '/tabs/Tab0',
        entryPoint: '/tabs/Tab0/index.tsx'
      });
    });

    it('Should return the config if the tab has tests', async () => {
      mockHasTestsOnce(true);
      await expect(utils.getTestConfiguration('/tabs/Tab0', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedTabsConfig,
          test: {
            ...configs.sharedTabsConfig.test!,
            name: 'Tab0 Tab',
            root: '/tabs/Tab0'
          }
        }
      });
    });

    it('Should return the config even if the function was called from not the tab\'s root directory', async () => {
      mockHasTestsOnce(true);
      await expect(utils.getTestConfiguration('/tabs/Tab0/sub/directory', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedTabsConfig,
          test: {
            ...configs.sharedTabsConfig.test!,
            name: 'Tab0 Tab',
            root: '/tabs/Tab0'
          }
        }
      });
    });

    it('Should return null if the tab has no tests', async () => {
      mockHasTestsOnce(false);
      await expect(utils.getTestConfiguration('/tabs/Tab0', false)).resolves.toMatchObject({
        severity: 'success',
        config: null
      });
    });
  });

  describe('With bundles', () => {
    beforeEach(() => {
      mockedReadFile.mockImplementation(p => {
        if (p === '/bundles/bundle0/package.json') {
          return Promise.resolve(JSON.stringify({
            name: '@sourceacademy/bundle-bundle0'
          }));
        }

        throw new ENOENT();
      });

      vi.spyOn(manifest, 'resolveSingleBundle').mockResolvedValueOnce({
        severity: 'success',
        bundle: {
          type: 'bundle',
          name: 'bundle0',
          manifest: {},
          directory: '/bundles/bundle0',
        }
      });
    });

    it('Should return the config if the bundle has tests', async () => {
      mockHasTestsOnce(true);
      await expect(utils.getTestConfiguration('/bundles/bundle0', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedVitestConfiguration,
          test: {
            ...configs.sharedVitestConfiguration.test!,
            name: 'bundle0 Bundle',
            root: '/bundles/bundle0'
          }
        }
      });
    });

    it('Should return the config even if the function was called from not the tab\'s root directory', async () => {
      mockHasTestsOnce(true);
      await expect(utils.getTestConfiguration('/bundles/bundle0/sub/directory', false)).resolves.toMatchObject({
        severity: 'success',
        config: {
          ...configs.sharedVitestConfiguration,
          test: {
            ...configs.sharedVitestConfiguration.test!,
            name: 'bundle0 Bundle',
            root: '/bundles/bundle0'
          }
        }
      });
    });

    it('Should return null if the bundle has no tests', async () => {
      mockHasTestsOnce(false);
      await expect(utils.getTestConfiguration('/bundles/bundle0', false)).resolves.toMatchObject({
        severity: 'success',
        config: null
      });
    });
  });

  describe('With neither', () => {
    beforeEach(() => {
      mockedReadFile.mockImplementation(p => {
        if (p === '/dir/package.json') {
          return Promise.resolve(JSON.stringify({
            name: "@sourceacademy/a-pacakge"
          }));
        }
        throw new ENOENT();
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
          errors: ['Tests were found for /dir, but no vitest config could be located']
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
  mockedReadFile.mockImplementation(p => {
    const RE = /^\/dir\/project(\d)\/package\.json$/;
    const match = RE.exec(p as string);
    if (match) {
      const [,index] = match;
      return Promise.resolve(JSON.stringify({
        name: `@sourceacademy/project${index}`
      }));
    }

    throw new ENOENT();
  });

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
        projects: ['/dir/project*']
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
            parentPath: '/dir'
          } as Dirent;
        }
      }

      yield {
        isDirectory: () => true,
        name: 'node_modules',
        parentPath: '/dir'
      } as Dirent;
    });

    const results = await utils.getAllTestConfigurations(false);
    expect(results.length).toEqual(3);
    expect(configs.loadVitestConfigFromDir).toHaveBeenCalledTimes(4);

    for (const result of results) {
      switch (result.root) {
        case '/dir/project0': {
          expect(results).toContainEqual({
            ...configs.sharedVitestConfiguration,
            test: {
              ...configs.sharedVitestConfiguration.test!,
              root: '/dir/project0',
              name: {
                label: 'project0',
                color: 'black'
              }
            }
          });
          break;
        }
        case '/dir/project1': {
          expect(results).toContainEqual({
            ...configs.sharedVitestConfiguration,
            test: {
              ...configs.sharedVitestConfiguration.test!,
              root: '/dir/project1',
              name: {
                label: 'project1',
                color: 'red'
              }
            }
          });
          break;
        }
        case '/dir/project2': {
          expect(results).toContainEqual({
            ...configs.sharedVitestConfiguration,
            test: {
              ...configs.sharedVitestConfiguration.test!,
              root: '/dir/project2',
              name: {
                label: 'project2',
                color: 'black'
              }
            }
          });
          break;
        }
      }
    }
  });
});
