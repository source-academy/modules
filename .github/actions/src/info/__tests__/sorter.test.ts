import { describe, expect, test } from 'vitest';
import { topoSortPackages } from '../sorter.js';

describe('Test topoSorter', () => {
  test('Without a cycle', () => {
    const result = topoSortPackages({
      '@sourceacademy/0': {
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
});
