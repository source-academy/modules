import pathlib from 'path'
import { bundlesOption, lintFixOption, manifestOption, retrieveBundlesAndTabs, srcDirOption, tabsOption, wrapWithTimer } from '@src/commandUtils'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { Command } from '@commander-js/extra-typings'
import { findSeverity, type BuildInputs, divideAndRound, type Severity } from '../utils'

const severityFinder = (results: ESLint.LintResult[]) => findSeverity(results, ({ warningCount, fatalErrorCount }) => {
	if (fatalErrorCount > 0) return 'error'
	if (warningCount > 0) return 'warn'
	return 'success'
})

interface LintOpts {
  srcDir: string
  fix?: boolean
}

interface LintResults {
  results: ESLint.LintResult[]
  formatter: ESLint.Formatter
  severity: Severity
}

export const runEslint = wrapWithTimer(async ({ bundles, tabs }: BuildInputs, { srcDir, fix }: LintOpts): Promise<LintResults> => {
	const linter = new ESLint({
		cwd: pathlib.resolve(srcDir),
		extensions: ['ts', 'tsx'],
		fix
	})

	let promise: Promise<ESLint.LintResult[]>
	if (tabs === undefined && bundles === undefined) {
		promise = linter.lintFiles('**/*.ts')
	} else {
		const fileNames: string[] = []
		if (bundles?.length > 0) {
			bundles.forEach((bundle) => `bundles/${bundle}/index.ts`)
		}

		if (tabs?.length > 0) {
			tabs.forEach((tabName) => fileNames.push(`tabs/${tabName}/index.tsx`))
		}

		promise = linter.lintFiles(fileNames)
	}

	const linterResults = await promise
	if (fix) {
		await ESLint.outputFixes(linterResults)
	}

	const outputFormatter = await linter.loadFormatter('stylish')
	const severity = severityFinder(linterResults)
	return {
		results: linterResults,
		formatter: outputFormatter,
		severity
	}
})

export const eslintResultsLogger = async ({ results, formatter, severity }: LintResults, elapsed: number) => {
	const formatted = await formatter.format(results)
	let errStr: string

	if (severity === 'error') errStr = chalk.cyanBright('with ') + chalk.redBright('errors')
	else if (severity === 'warn') errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings')
	else errStr = chalk.greenBright('successfully')

	return `${chalk.cyanBright(`Linting completed in ${divideAndRound(elapsed, 1000)}s ${errStr}:`)}\n${formatted}`
}

export function getLintCommand() {
	return new Command('lint')
		.description('Run eslint')
		.addOption(srcDirOption)
		.addOption(lintFixOption)
		.addOption(manifestOption)
		.addOption(bundlesOption)
		.addOption(tabsOption)
		.action(async (opts) => {
			const inputs = await retrieveBundlesAndTabs(opts.manifest, opts.bundles, opts.tabs)
			const { result, elapsed } = await runEslint(inputs, opts)
			const output = await eslintResultsLogger(result, elapsed)
			console.log(output)
		})
}
