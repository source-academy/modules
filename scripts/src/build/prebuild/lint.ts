import { lintFixOption, retrieveBundlesAndTabs, wrapWithTimer } from '@src/commandUtils'
import { loadESLint, type ESLint } from 'eslint'
import chalk from 'chalk'
import { findSeverity, divideAndRound, type Severity, type AwaitedReturn } from '../utils'
import { createPrebuildCommand, createPrebuildCommandHandler, type PrebuildOptions } from './utils'

const severityFinder = (results: ESLint.LintResult[]) => findSeverity(results, ({ warningCount, fatalErrorCount }) => {
  if (fatalErrorCount > 0) return 'error'
  if (warningCount > 0) return 'warn'
  return 'success'
})

/*
	Unfortunately, people like to leave parts of their API
	undocumented, so using the FlatConfig linter with the
	current version of eslint means we can't get any
	typing for it
*/

interface LintResults {
  formatted: string
  severity: Severity
}

interface LintOptions extends PrebuildOptions {
	fix?: boolean
}

export const runEslint = wrapWithTimer(async ({ bundles, tabs, srcDir, fix }: LintOptions): Promise<LintResults> => {
  const ESlint = await loadESLint({ useFlatConfig: true })
  const linter = new ESlint({ fix })

  const fileNames = [
    ...bundles.map(bundleName => `${srcDir}/bundles/${bundleName}/**/*.ts`),
    ...tabs.map(tabName => `${srcDir}/tabs/${tabName}/**/*.ts*`)
  ]

  try {
    const linterResults = await linter.lintFiles(fileNames)
    if (fix) {
      await ESlint.outputFixes(linterResults)
    }

    const outputFormatter = await linter.loadFormatter('stylish')
    const formatted = await outputFormatter.format(linterResults)
    const severity = severityFinder(linterResults)
    return {
      formatted,
      severity
    }
  } catch (error) {
    return {
      severity: 'error',
      formatted: error.toString()
    }
  }
})

export function eslintResultsLogger({ elapsed, result: { formatted, severity } }: AwaitedReturn<typeof runEslint>) {
  let errStr: string

  if (severity === 'error') errStr = chalk.cyanBright('with ') + chalk.redBright('errors')
  else if (severity === 'warn') errStr = chalk.cyanBright('with ') + chalk.yellowBright('warnings')
  else errStr = chalk.greenBright('successfully')

  return `${chalk.cyanBright(`Linting completed in ${divideAndRound(elapsed, 1000)}s ${errStr}:`)}\n${formatted}`
}

const lintCommandHandler = createPrebuildCommandHandler((...args) => runEslint(...args), eslintResultsLogger)

export function getLintCommand() {
  return createPrebuildCommand('lint', 'Run eslint')
    .addOption(lintFixOption)
    .action(async opts => {
      const inputs = await retrieveBundlesAndTabs(opts, false)
      await lintCommandHandler({ ...opts, ...inputs })
    })
}
