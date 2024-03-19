import pathlib from 'path'
import fs from 'fs/promises'
import chalk from 'chalk'
import { retrieveBundlesAndTabs, wrapWithTimer } from '@src/commandUtils'
import ts from 'typescript'
import { expandBundleNames, type Severity, expandTabNames, divideAndRound, type AwaitedReturn } from '../utils'
import { createPrebuildCommand, createPrebuildCommandHandler, type PrebuildOptions } from './utils'

type TsconfigResult = {
  severity: 'success',
  results: ts.CompilerOptions
} | {
  severity: 'error',
  results: ts.Diagnostic[]
}

interface TscResult {
  severity: Severity,
  results: ts.Diagnostic[]
}

async function getTsconfig(srcDir: string): Promise<TsconfigResult> {
	// Step 1: Read the text from tsconfig.json
	const tsconfigLocation = pathlib.join(srcDir, 'tsconfig.json')
	try {
		const configText = await fs.readFile(tsconfigLocation, 'utf-8')

		// Step 2: Parse the raw text into a json object
		const { error: configJsonError, config: configJson } = ts.parseConfigFileTextToJson(tsconfigLocation, configText)
		if (configJsonError) {
			return {
				severity: 'error',
				results: [configJsonError]
			}
		}

		// Step 3: Parse the json object into a config object for use by tsc
		const { errors: parseErrors, options: tsconfig } = ts.parseJsonConfigFileContent(configJson, ts.sys, srcDir)
		if (parseErrors.length > 0) {
			return {
				severity: 'error',
				results: parseErrors
			}
		}

		return {
			severity: 'success',
			results: tsconfig
		}
	} catch (error) {
		return {
			severity: 'error',
			results: [error]
		}
	}
}

export const runTsc = wrapWithTimer(async ({ bundles, tabs, srcDir }: PrebuildOptions): Promise<TscResult> => {
	const tsconfigRes = await getTsconfig(srcDir)
	if (tsconfigRes.severity === 'error') {
		return {
			severity: 'error',
			results: tsconfigRes.results
		}
	}

	const fileNames: string[] = []

	if (bundles.length > 0) {
		expandBundleNames(srcDir, bundles)
			.forEach((name) => fileNames.push(name))
	}

	if (tabs.length > 0) {
		expandTabNames(srcDir, tabs)
			.forEach((name) => fileNames.push(name))
	}

	const tsc = ts.createProgram(fileNames, tsconfigRes.results)
	const results = tsc.emit()
	const diagnostics = ts.getPreEmitDiagnostics(tsc)
		.concat(results.diagnostics)

	return {
		severity: diagnostics.length > 0 ? 'error' : 'success',
		results: diagnostics
	}
})

export function tscResultsLogger({ elapsed, result: { results, severity } }: AwaitedReturn<typeof runTsc>) {
	const diagStr = ts.formatDiagnosticsWithColorAndContext(results, {
		getNewLine: () => '\n',
		getCurrentDirectory: () => process.cwd(),
		getCanonicalFileName: (name) => pathlib.basename(name)
	})

	if (severity === 'error') {
		return `${diagStr}\n${chalk.cyanBright(`tsc finished with ${chalk.redBright('errors')} in ${divideAndRound(elapsed, 1000)}s`)}`
	}
	return `${diagStr}\n${chalk.cyanBright(`tsc completed ${chalk.greenBright('successfully')} in ${divideAndRound(elapsed, 1000)}s`)}`
}

const tscCommandHandler = createPrebuildCommandHandler(
	runTsc,
	tscResultsLogger
)

export const getTscCommand = () => createPrebuildCommand('tsc', 'Run the typescript compiler to perform type checking')
	.action(async opts => {
		const inputs = await retrieveBundlesAndTabs(opts.manifest, opts.bundles, opts.tabs, false)
		await tscCommandHandler({ ...opts, ...inputs })
	})
