import fs from 'fs/promises'
import { build as esbuild, type Plugin as ESBuildPlugin } from 'esbuild';
import { bundlesOption, promiseAll } from '@src/commandUtils';
import { expandBundleNames, type BuildTask, createBuildCommandHandler, createBuildCommand } from '../utils';
import { commonEsbuildOptions, outputBundleOrTab } from './commons';

export const assertPolyfillPlugin: ESBuildPlugin = {
	name: 'Assert Polyfill',
	setup(build) {
		// Polyfill the NodeJS assert module
		build.onResolve({ filter: /^assert/u }, () => ({
			path: 'assert',
			namespace: 'bundleAssert'
		}));

		build.onLoad({
			filter: /^assert/u,
			namespace: 'bundleAssert'
		}, () => ({
			contents: `
      export default function assert(condition, message) {
        if (condition) return;

        if (typeof message === 'string' || message === undefined) {
          throw new Error(message);
        }

        throw message;
      }
      `
		}));
	}
};

// const jsslangExports = [
//   'js-slang',
//   'js-slang/context',
//   'js-slang/dist/cse-machine/interpreter',
//   'js-slang/dist/stdlib',
//   'js-slang/dist/types',
//   'js-slang/dist/utils',
//   'js-slang/dist/parser/parser',
// ]

// const jsSlangExportCheckingPlugin: ESBuildPlugin = {
//   name: 'js-slang import checker',
//   setup(pluginBuild) {
//     pluginBuild.onResolve({ filter: /^js-slang/u }, args => {
//       if (!jsslangExports.includes(args.path)) {
//         return {
//           errors: [{
//             text: `The import ${args.path} from js-slang is not currently supported`
//           }]
//         }
//       }

//       return args
//     })
//   }
// }

export const bundleBundles: BuildTask = async ({ bundles }, { srcDir, outDir }) => {
	const [{ outputFiles }] = await promiseAll(esbuild({
		...commonEsbuildOptions,
		entryPoints: expandBundleNames(srcDir, bundles),
		outbase: outDir,
		outdir: outDir,
		plugins: [
			assertPolyfillPlugin
			// jsSlangExportCheckingPlugin,
		],
		tsconfig: `${srcDir}/tsconfig.json`
	}), fs.mkdir(`${outDir}/bundles`, { recursive: true }));

	const results = await Promise.all(outputFiles.map((file) => outputBundleOrTab(file, outDir)));
	return { bundles: results }
}

const bundlesCommandHandler = createBuildCommandHandler((...args) => bundleBundles(...args), true)

export const getBuildBundlesCommand = () => createBuildCommand(
	'bundles',
	'Build bundles'
)
	.addOption(bundlesOption)
	.action(opts => bundlesCommandHandler({ ...opts, tabs: [] }))
