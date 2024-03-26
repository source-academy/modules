import { Option } from '@commander-js/extra-typings';
import type { AwaitedReturn } from './build/utils';
import { retrieveManifest } from './manifest';

class OptionNew<
  UsageT extends string = '',
  PresetT = undefined,
  DefaultT = undefined,
  CoerceT = undefined,
  Mandatory extends boolean = false,
  ChoicesT = undefined
> extends Option<UsageT, PresetT, DefaultT, CoerceT, Mandatory, ChoicesT> {
  default<T>(
    value: T,
    description?: string
  ): Option<UsageT, PresetT, T, CoerceT, true, ChoicesT> {
    return super.default(value, description);
  }
}

export const srcDirOption = new OptionNew(
  '--srcDir <srcDir>',
  'Location of the source files'
).default('src');

export const outDirOption = new OptionNew(
  '--outDir <outDir>',
  'Location of output directory'
).default('build');

export const manifestOption = new OptionNew(
  '--manifest <manifest>',
  'Location of manifest'
).default('modules.json');

export const lintOption = new OptionNew('--lint', 'Run ESLint');

export const lintFixOption = new OptionNew(
  '--fix',
  'Fix automatically fixable linting errors'
).implies({ lint: true });

export const bundlesOption = new OptionNew(
  '-b, --bundles <bundles...>',
  'Manually specify which bundles'
).default(null);

export const tabsOption = new OptionNew(
  '-t, --tabs <tabs...>',
  'Manually specify which tabs'
).default(null);

export async function retrieveBundlesAndTabs(
  {
    bundles,
    tabs,
    manifest: manifestFile
  }: {
    bundles?: string[] | null;
    tabs?: string[] | null;
    manifest: string;
  },
  shouldAddModuleTabs: boolean
) {
  const manifest = await retrieveManifest(manifestFile);
  const knownBundles = Object.keys(manifest);
  const knownTabs = Object.values(manifest).flatMap(x => x.tabs);

  const isUndefinedOrNull = (x: any): x is null | undefined =>
    x === undefined || x === null;

  let bundlesOutput: string[];
  let tabsOutput: string[];

  if (isUndefinedOrNull(bundles)) {
    // User did not specify any bundles, select all
    bundlesOutput = knownBundles;
  } else {
    const unknownBundles = bundles.filter(
      bundleName => !knownBundles.includes(bundleName)
    );
    if (unknownBundles.length > 0) {
      throw new Error(`Unknown bundles: ${unknownBundles.join(', ')}`);
    }

    bundlesOutput = bundles;
  }

  if (isUndefinedOrNull(tabs)) {
    // User did not specify any tabs, select all
    tabsOutput = knownTabs;
  } else {
    const unknownTabs = tabs.filter(tabName => !knownTabs.includes(tabName));
    if (unknownTabs.length > 0) {
      throw new Error(`Unknown tabs: ${unknownTabs.join(', ')}`);
    }

    tabsOutput = tabs;
  }

  if (shouldAddModuleTabs) {
    // If certain bundles are being rebuilt, then their tabs
    // should also be rebuilt
    bundlesOutput.forEach(bundleName => {
      manifest[bundleName].tabs.forEach(tabName => {
        tabsOutput.push(tabName);
      });
    });
  }

  return {
    bundles: [...new Set(bundlesOutput)],
    tabs: [...new Set(tabsOutput)],
    modulesSpecified: !isUndefinedOrNull(bundles)
  };
}

export function promiseAll<T extends Promise<any>[]>(
  ...args: T
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  return Promise.all(args);
}

export interface TimedResult<T> {
  result: T;
  elapsed: number;
}

export function wrapWithTimer<T extends (...args: any[]) => Promise<any>>(
  func: T
) {
  return async (
    ...args: Parameters<T>
  ): Promise<TimedResult<AwaitedReturn<T>>> => {
    const startTime = performance.now();
    const result = await func(...args);
    return {
      result,
      elapsed: performance.now() - startTime
    };
  };
}

type ValuesOfRecord<T> = T extends Record<any, infer U> ? U : never;

export type EntriesOfRecord<T extends Record<any, any>> = ValuesOfRecord<{
  [K in keyof T]: [K, T[K]];
}>;

export function objectEntries<T extends Record<any, any>>(obj: T) {
  return Object.entries(obj) as EntriesOfRecord<T>[];
}
