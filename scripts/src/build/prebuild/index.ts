import { type Severity, findSeverity, type BuildOptions, type BuildInputs } from '@src/build/utils'
import { promiseAll } from '@src/commandUtils'
import { runTsc } from './tsc'
import { runEslint } from './lint'

interface PrebuildResult {
  lint?: Awaited<ReturnType<typeof runEslint>>
  tsc?: Awaited<ReturnType<typeof runTsc>>
  severity: Severity
}

export default async function prebuild(
	inputs: BuildInputs,
	{ tsc, lint, ...opts }: BuildOptions
): Promise<PrebuildResult> {
	if (tsc) {
		if (!lint) {
			const tsc = await runTsc(inputs, opts.srcDir)
			return {
				tsc,
				severity: tsc.result.severity
			}
		}

		const [tscResult, lintResult] = await promiseAll(
			runTsc(inputs, opts.srcDir),
			runEslint(inputs, opts)
		)

		const overallSev = findSeverity([tscResult, lintResult], ({ result: { severity } }) => severity)

		return {
			tsc: tscResult,
			lint: lintResult,
			severity: overallSev
		}
	}

	if (lint) {
		const lintResult = await runEslint(inputs, opts)
		return {
			lint: lintResult,
			severity: lintResult.result.severity
		}
	}
	return {
		severity: 'success'
	}
}
