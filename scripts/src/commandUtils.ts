import fs from 'fs/promises';
import { Option } from '@commander-js/extra-typings';
import type { AwaitedReturn } from './build/utils';

export type ModuleManifest = Record<string, { tabs: string[] }>

class OptionNew<
  UsageT extends string = '',
  PresetT = undefined,
  DefaultT = undefined,
  CoerceT = undefined,
  Mandatory extends boolean = false,
  ChoicesT = undefined
>
	extends Option<UsageT, PresetT, DefaultT, CoerceT, Mandatory, ChoicesT> {
	default<T>(value: T, description?: string): Option<UsageT, PresetT, T, CoerceT, true, ChoicesT> {
		return super.default(value, description);
	}
}

export const srcDirOption = new OptionNew('--srcDir <srcDir>', 'Location of the source files')
	.default('src');

export const outDirOption = new OptionNew('--outDir <outDir>', 'Location of output directory')
	.default('build');

export const manifestOption = new OptionNew('--manifest <manifest>', 'Location of manifest')
	.default('modules.json');

export const lintOption = new OptionNew('--lint', 'Run ESLint');

export const lintFixOption = new OptionNew('--fix', 'Fix automatically fixable linting errors')
	.implies({ lint: true });

export const bundlesOption = new OptionNew('-b, --bundles <bundles...>', 'Manually specify which bundles')
	.default(null);

export const tabsOption = new OptionNew('-t, --tabs <tabs...>', 'Manually specify which tabs')
	.default<string[] | null>(null);

export const retrieveManifest = async (manifest: string) => {
	try {
		const rawManifest = await fs.readFile(manifest, 'utf-8');
		return JSON.parse(rawManifest) as ModuleManifest;
	} catch (error) {
		if (error.code === 'ENOENT') throw new Error(`Could not locate manifest file at ${manifest}`);
		throw error;
	}
};

/**
 * Determines which bundles and tabs to build based on the user's input.
 *
 * If no modules and no tabs are specified, it is assumed the user wants to
 * build everything.
 *
 * If modules but no tabs are specified, it is assumed the user only wants to
 * build those bundles (and possibly those modules' tabs based on
 * shouldAddModuleTabs).
 *
 * If tabs but no modules are specified, it is assumed the user only wants to
 * build those tabs.
 *
 * If both modules and tabs are specified, both of the above apply and are
 * combined.
 *
 * @param modules module names specified by the user
 * @param tabOptions tab names specified by the user
 * @param shouldAddModuleTabs whether to also automatically include the tabs of
 * specified modules
 */
export const retrieveBundlesAndTabs = async (
	manifestFile: string,
	modules: string[] | null,
	tabOptions: string[] | null,
	shouldAddModuleTabs: boolean = true
) => {
	const manifest = await retrieveManifest(manifestFile);
	const knownBundles = Object.keys(manifest);
	const knownTabs = Object
		.values(manifest)
		.flatMap((x) => x.tabs);

	let bundles: string[] = [];
	let tabs: string[] = [];

	function addSpecificModules() {
		// If unknown modules were specified, error
		const unknownModules = modules.filter((m) => !knownBundles.includes(m));
		if (unknownModules.length > 0) {
			throw new Error(`Unknown modules: ${unknownModules.join(', ')}`);
		}

		bundles = bundles.concat(modules);

		if (shouldAddModuleTabs) {
			// Add the modules' tabs too
			tabs = [...tabs, ...modules.flatMap((bundle) => manifest[bundle].tabs)];
		}
	}
	function addSpecificTabs() {
		// If unknown tabs were specified, error
		const unknownTabs = tabOptions.filter((t) => !knownTabs.includes(t));
		if (unknownTabs.length > 0) {
			throw new Error(`Unknown tabs: ${unknownTabs.join(', ')}`);
		}

		tabs = tabs.concat(tabOptions);
	}
	function addAllBundles() {
		bundles = bundles.concat(knownBundles);
	}
	function addAllTabs() {
		tabs = tabs.concat(knownTabs);
	}

	if (modules === null && tabOptions === null) {
		addAllBundles();
		addAllTabs();
	} else {
		if (modules !== null) addSpecificModules();
		if (tabOptions !== null) addSpecificTabs();
	}

	return {
		bundles: [...new Set(bundles)],
		tabs: [...new Set(tabs)],
		modulesSpecified: modules !== null
	};
};

export function promiseAll<T extends Promise<any>[]>(...args: T): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
	return Promise.all(args);
}

export interface TimedResult<T> {
  result: T
  elapsed: number
}

export function wrapWithTimer<T extends(...args: any[]) => Promise<any>>(func: T) {
	return async (...args: Parameters<T>): Promise<TimedResult<AwaitedReturn<T>>> => {
		const startTime = performance.now();
		const result = await func(...args);
		return {
			result,
			elapsed: performance.now() - startTime
		};
	};
}

type ValuesOfRecord<T> = T extends Record<any, infer U> ? U : never

export type EntriesOfRecord<T extends Record<any, any>> = ValuesOfRecord<{
  [K in keyof T]: [K, T[K]]
}>

export function objectEntries<T extends Record<any, any>>(obj: T) {
	return Object.entries(obj) as EntriesOfRecord<T>[];
}
