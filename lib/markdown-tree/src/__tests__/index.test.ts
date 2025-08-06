import fs from 'fs';
import { describe, expect, test, vi } from 'vitest';
import { generateStructure } from '../structure';
import { generateTree } from '../tree';
import { isRootYamlObject, isYamlObject } from '../types';

const mockExistsSync = vi.spyOn(fs, 'existsSync');
const mockStatSync = vi.spyOn(fs, 'statSync').mockReturnValue({
  isDirectory: () => true
} as any);

describe('Test isYamlObject', () => {
  const testCases: [string, unknown, boolean][] = [
    ['Name property is required', {}, false],
    ['Name property is required', { comment: 'oops' }, false],
    ['Name is not of type string', { name: 0 }, false],
    ['Name property is present and of type string', { name: 'test' }, true],

    ['Comment is not of type string', { name: 'test', comment: 0 }, false],

    ['Children should be array', { name: 'test', children: null }, false],
    ['Empty children array is okay', { name: 'test', children: [] }, true],
    ['Strings are valid children', { name: 'test', children: ['what'] }, true],
    ['Objects are valid children', { name: 'test', children: [{ name: 'what', comment: 'yo' }] }, true],
    ['Invalid child object', { name: 'test', children: [{ name: 'what', comment: 0 }] }, false],
    ['Invalid child in array', { name: 'test', children: [0] }, false]
  ];

  test.each(testCases)('%s', (_, obj, expected) => expect(isYamlObject(obj)).toEqual(expected));
});

describe('Test isRootYamlObject', () => {
  test('path is required property', () => {
    expect(isRootYamlObject({
      name: 'root',
      path: 'yes'
    })).toEqual(true);
  });

  test('missing path property returns is ok', () => {
    expect(isRootYamlObject({
      name: 'root',
    })).toEqual(true);
  });

  test('non-string path property returns false', () => {
    expect(isRootYamlObject({
      name: 'root',
      path: 0
    })).toEqual(false);
  });
});

test('structure generation', () => {
  const [structure, commentLoc, warnings] = generateStructure({
    name: 'root',
    children: [{
      name: 'item1',
      comment: 'this is a comment'
    },
    'item2',
    {
      name: 'item3',
      comment: 'also a comment'
    }
    ]
  });
  expect(warnings.length).toEqual(0);
  expect(generateTree(structure, commentLoc)).toMatchInlineSnapshot(`
    "root
    ├── item1  // this is a comment
    ├── item2
    └── item3  // also a comment"
  `);
});

describe('Test tree validation', () => {
  const validPaths = [
    '/',
    '/real_item0',
    '/real_item1',
    '/real_item1/real_item2',
  ];

  mockExistsSync.mockImplementation(path => validPaths.includes(path as string));

  test('Successful validation', () => {
    const [,,warnings] = generateStructure({
      path: '.',
      name: 'root',
      children: [
        'real_item0',
        {
          name: 'real_item1',
          children: ['real_item2']
        }
      ]
    }, '/');
    expect(warnings.length).toEqual(0);
    expect(fs.existsSync).toHaveBeenCalledTimes(4);
  });

  test('Unsuccessful validation when child item doesn\'t exist', () => {
    const [,,warnings] = generateStructure({
      path: '.',
      name: 'root',
      children: ['fake_item0']
    }, '/');

    expect(warnings.length).toEqual(1);
    expect(fs.existsSync).toHaveBeenCalledTimes(2);
  });

  test('Unsuccessful validation when item with children is not a folder', () => {
    mockStatSync.mockReturnValueOnce({
      isDirectory: () => false
    } as any);

    const [,,warnings] = generateStructure({
      path: '.',
      name: 'root',
      children: [{
        name: 'real_item0',
        children: ['real_item2']
      }]
    }, '/');

    expect(warnings.length).toEqual(1);
    expect(fs.existsSync).toHaveBeenCalledTimes(3);
  });

  test('Not providing a path means no validation is run', () => {
    const [,,warnings] = generateStructure({
      path: '.',
      name: 'root',
      children: [{
        name: 'real_item1',
        children: ['real_item2']
      }]
    });

    expect(warnings.length).toEqual(0);
    expect(fs.existsSync).not.toHaveBeenCalled();
    expect(fs.statSync).not.toHaveBeenCalled();
  });
});
