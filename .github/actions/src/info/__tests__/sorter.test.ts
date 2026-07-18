import { describe, expect, test } from 'vitest';
import { topoSortPackages } from '../sorter.js';

describe(topoSortPackages, () => {
  test('Without a cycle', () => {
    const result = topoSortPackages({
      '@sourceacademy/0': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/0',
          devDependencies: {
            '@sourceacademy/1': 'workspace:^'
          },
          dependencies: {}
        }
      },
      '@sourceacademy/1': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/1',
          devDependencies: {
            '@sourceacademy/2': 'workspace:^'
          },
          dependencies: {}
        }
      },
      '@sourceacademy/2': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/2',
          devDependencies: {},
          dependencies: {}
        }
      }
    });

    expect(result).toEqual([
      '@sourceacademy/2',
      '@sourceacademy/1',
      '@sourceacademy/0',
    ]);
  });

  test('With a cycle', () => {
    const func = () => topoSortPackages({
      '@sourceacademy/0': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/0',
          devDependencies: {
            '@sourceacademy/1': 'workspace:^'
          },
          dependencies: {}
        }
      },
      '@sourceacademy/1': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/1',
          devDependencies: {
            '@sourceacademy/2': 'workspace:^'
          },
          dependencies: {}
        }
      },
      '@sourceacademy/2': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/2',
          devDependencies: {},
          dependencies: {
            '@sourceacademy/0': 'workspace:^'
          }
        }
      }
    });

    expect(func).toThrowError('Dependency graph has a cycle!');
  });

  test('A dependency sharing the @sourceacademy scope but not a local workspace package (e.g. the real published @sourceacademy/conductor npm package) is ignored, not treated as a graph node', () => {
    const result = topoSortPackages({
      '@sourceacademy/0': {
        type: null,
        hasChanges: false,
        directory: '/',
        package: {
          name: '@sourceacademy/0',
          devDependencies: {},
          dependencies: {
            // Not a key of this packages record at all - a real npm dependency, not a workspace
            // package - so it must not end up in the topological order (there's no
            // RawPackageRecord for it, and processRawPackages would crash reading .hasChanges off
            // undefined otherwise).
            '@sourceacademy/conductor': 'npm:^0.7.1'
          }
        }
      }
    });

    expect(result).toEqual(['@sourceacademy/0']);
  });
});
