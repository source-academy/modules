import fs from 'fs/promises'
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import { promiseAll } from '@src/commandUtils';
import { expandTabNames, createBuildCommandHandler, type BuildTask, createBuildCommand } from '../utils';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';

export const tabContextPlugin: ESBuildPlugin = {
	name: 'Tab Context',
	setup(build) {
		build.onResolve({ filter: /^js-slang\/context/u }, () => ({
			errors: [{
				text: 'If you see this message, it means that your tab code is importing js-slang/context directly or indirectly. Do not do this'
			}]
		}));
	}
};

export const bundleTabs: BuildTask = async ({ tabs }, { srcDir, outDir }) => {
	const [{ outputFiles }] = await promiseAll(esbuild({
		...commonEsbuildOptions,
		entryPoints: expandTabNames(srcDir, tabs),
		external: [
			...commonEsbuildOptions.external,
			'react',
			'react-ace',
			'react-dom',
			'react/jsx-runtime',
			'@blueprintjs/*'
			// 'phaser',
		],
		jsx: 'automatic',
		outbase: outDir,
		outdir: outDir,
		tsconfig: `${srcDir}/tsconfig.json`,
		plugins: [tabContextPlugin]
	}), fs.mkdir(`${outDir}/tabs`, { recursive: true }));

	const results = await Promise.all(outputFiles.map((file) => outputBundleOrTab(file, outDir)));
	return { tabs: results }
}

const tabCommandHandler = createBuildCommandHandler(bundleTabs)
export const getBuildTabsCommand = () => createBuildCommand('tabs', 'Build tabs')
	.argument('[tabs...]')
	.action((tabs, opts) => tabCommandHandler({
		tabs,
		bundles: []
	}, opts))