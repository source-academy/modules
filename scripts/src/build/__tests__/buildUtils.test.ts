import { retrieveBundlesAndTabs } from '../buildUtils';

jest.mock('../../scriptUtils');

describe('Test retrieveBundlesAndTabs', () => {
  it('should return all bundles and tabs when null is passed for modules', async () => {
    const result = await retrieveBundlesAndTabs('', null, null);

    expect(result.bundles)
      .toEqual(expect.arrayContaining(['test0', 'test1', 'test2']));
    expect(result.modulesSpecified)
      .toBe(false);
    expect(result.tabs)
      .toEqual(expect.arrayContaining(['tab0', 'tab1']));
  });

  it('should return only specific bundles and their tabs when an array is passed for modules', async () => {
    const result = await retrieveBundlesAndTabs('', ['test0'], null);

    expect(result.bundles)
      .toEqual(expect.arrayContaining(['test0']));
    expect(result.modulesSpecified)
      .toBe(true);
    expect(result.tabs)
      .toEqual(expect.arrayContaining(['tab0']));
  });

  it('should return only tabs when an empty array is passed for modules', async () => {
    const result = await retrieveBundlesAndTabs('', [], null);

    expect(result.bundles)
      .toEqual([]);
    expect(result.modulesSpecified)
      .toBe(true);
    expect(result.tabs)
      .toEqual(expect.arrayContaining(['tab0', 'tab1']));
  });

  it('should return tabs from the specified modules, and concatenate specified tabs', async () => {
    const result = await retrieveBundlesAndTabs('', ['test0'], ['tab1']);

    expect(result.bundles)
      .toEqual(['test0']);
    expect(result.modulesSpecified)
      .toBe(true);
    expect(result.tabs)
      .toEqual(expect.arrayContaining(['tab0', 'tab1']));
  });

  it('should return only specified tabs when addTabs is false', async () => {
    const result = await retrieveBundlesAndTabs('', ['test0'], ['tab1'], false);

    expect(result.bundles)
      .toEqual(['test0']);
    expect(result.modulesSpecified)
      .toBe(true);
    expect(result.tabs)
      .toEqual(['tab1']);
  });

  it('should throw an exception when encountering unknown modules or tabs', () => Promise.all([
    expect(retrieveBundlesAndTabs('', ['random'], null)).rejects.toMatchObject(new Error('Unknown modules: random')),
    expect(retrieveBundlesAndTabs('', [], ['random1', 'random2'])).rejects.toMatchObject(new Error('Unknown tabs: random1, random2'))
  ]));

  it('should always return unique modules and tabs', async () => {
    const result = await retrieveBundlesAndTabs('', ['test0', 'test0'], ['tab0']);

    expect(result.bundles)
      .toEqual(['test0']);
    expect(result.modulesSpecified)
      .toBe(true);
    expect(result.tabs)
      .toEqual(['tab0']);
  })
});
