import { retrieveBundles, retrieveBundlesAndTabs, retrieveTabs } from '@src/commandUtils';

describe('Test retrieveBundlesAndTabs', () => {
  type TestCase = [
    desc: string,
    {
      bundles?: string[] | null;
      tabs?: string[] | null;
    },
    boolean,
    Awaited<ReturnType<typeof retrieveBundlesAndTabs>>
  ];

  const testCases: TestCase[] = [
    [
      'Should return all bundles and tabs when null is given for both and shouldAddModuleTabs is true',
      {},
      true,
      {
        modulesSpecified: false,
        bundles: ['test0', 'test1', 'test2'],
        tabs: ['tab0', 'tab1']
      }
    ],
    [
      'Should return all bundles and tabs when null is given for both and shouldAddModuleTabs is false',
      {},
      false,
      {
        modulesSpecified: false,
        bundles: ['test0', 'test1', 'test2'],
        tabs: ['tab0', 'tab1']
      }
    ],
    [
      'Should add the tabs of specified bundles if shouldAddModuleTabs is true',
      { bundles: ['test0'], tabs: [] },
      true,
      {
        modulesSpecified: true,
        bundles: ['test0'],
        tabs: ['tab0']
      }
    ],
    [
      'Should not add the tabs of specified bundles if shouldAddModuleTabs is false',
      { bundles: ['test0'], tabs: [] },
      false,
      {
        modulesSpecified: true,
        bundles: ['test0'],
        tabs: []
      }
    ],
    [
      'Should only return specified tabs if shouldAddModuleTabs is false',
      { bundles: [], tabs: ['tab0', 'tab1'] },
      false,
      {
        modulesSpecified: true,
        bundles: [],
        tabs: ['tab0', 'tab1']
      }
    ],
    [
      'Should only return specified tabs even if shouldAddModuleTabs is true',
      { bundles: [], tabs: ['tab0', 'tab1'] },
      true,
      {
        modulesSpecified: true,
        bundles: [],
        tabs: ['tab0', 'tab1']
      }
    ],
    [
      'Should return specified tabs and bundles (and the tabs of those bundles) if shouldAddModuleTabs is true',
      {
        bundles: ['test0'],
        tabs: ['tab1']
      },
      true,
      {
        modulesSpecified: true,
        bundles: ['test0'],
        tabs: ['tab0', 'tab1']
      }
    ],
    [
      'Should only return specified tabs and bundles if shouldAddModuleTabs is false',
      {
        bundles: ['test0'],
        tabs: ['tab1']
      },
      false,
      {
        modulesSpecified: true,
        bundles: ['test0'],
        tabs: ['tab1']
      }
    ]
  ];

  test.each(testCases)('%#. %s:', async (_, { bundles, tabs }, shouldAddModuleTabs, expected) => {
    const outputs = await retrieveBundlesAndTabs('modules.json', bundles, tabs, shouldAddModuleTabs);

    expect(outputs)
      .toMatchObject(expected);
  });

  it('should throw an exception when encountering unknown modules or tabs', () => Promise.all([
    expect(retrieveBundlesAndTabs('', ['random'], [], true))
      .rejects.toMatchObject(new Error('Unknown bundles: random')),

    expect(retrieveBundlesAndTabs('', [], ['random1', 'random2'], false))
      .rejects.toMatchObject(new Error('Unknown tabs: random1, random2'))
  ]));

  it('should always return unique modules and tabs', async () => {
    const result = await retrieveBundlesAndTabs('', ['test0', 'test0'],['tab0'], false);

    expect(result.bundles)
      .toEqual(['test0']);
    expect(result.modulesSpecified)
      .toBe(true);
    expect(result.tabs)
      .toEqual(['tab0']);
  });
});

describe('test retrieveBundles', () => {
  it('should throw an exception when encountering unknown bundles', () => expect(retrieveBundles('', ['unknown']))
    .rejects
    .toMatchInlineSnapshot('[Error: Unknown bundles: unknown]')
  );

  it('should always return unique bundles', () => expect(retrieveBundles('', ['test0', 'test0']))
    .resolves
    .toMatchObject({
      bundles: ['test0'],
      modulesSpecified: true
    }));
});

describe('test retrieveTabs', () => {
  it('should throw an exception when encountering unknown tabs', () => expect(retrieveTabs('', ['unknown']))
    .rejects
    .toMatchInlineSnapshot('[Error: Unknown tabs: unknown]')
  );

  it('should always return unique bundles', () => expect(retrieveTabs('', ['tab0', 'tab0']))
    .resolves
    .toMatchObject({
      tabs: ['tab0']
    }));
});
