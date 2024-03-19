import type { MockedFunction } from 'jest-mock'
import type { Command } from "@commander-js/extra-typings";
import fs from 'fs/promises'

import * as tsc from '../prebuild/tsc'
jest.spyOn(tsc, 'runTsc')

import * as lint from '../prebuild/lint'
jest.spyOn(lint, 'runEslint')

const mockedTsc = tsc.runTsc as MockedFunction<typeof tsc.runTsc>
const mockedLint = lint.runEslint as MockedFunction<typeof lint.runEslint>

export function testBuildCommand(
  commandName: string,
  commandGetter: (...args: string[]) => Command<any, any>,
  mockedFunctions: MockedFunction<any>[]
) {
  function expectToBeCalled(times: number) {
    mockedFunctions.forEach(func => expect(func).toHaveBeenCalledTimes(times))
  }

  function runCommand(...args: string[]) {
    return commandGetter().parseAsync(args, { from: 'user' })
  }

  test(`${commandName} should run tsc when --tsc is specified`, async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: {
        severity: 'success',
        results: []
      }
    })

    await runCommand('--tsc')
    expect(tsc.runTsc).toHaveBeenCalledTimes(1)
    expectToBeCalled(1)
  })

  test(`${commandName} should not run if tsc throws an error`, async () => {
    mockedTsc.mockResolvedValueOnce({
      elapsed: 0,
      result: {
        severity: 'error',
        results: []
      }
    })

    await expect(runCommand('--tsc'))
      .rejects
      .toMatchInlineSnapshot('[Error: process.exit called with 1]')

    expect(tsc.runTsc).toHaveBeenCalledTimes(1)
    expectToBeCalled(0)
  })

  test(`${commandName} should run linting when --lint is specified`, async () => {
    mockedLint.mockResolvedValueOnce({
      elapsed: 0,
      result: {
        severity: 'success',
        formatted: ''
      }
    })
    await runCommand('--lint')
    expect(lint.runEslint).toHaveBeenCalledTimes(1)
    expectToBeCalled(1)
  })

  test(`${commandName} should not run if linting throws an error`, async () => {
    mockedLint.mockResolvedValueOnce({
      elapsed: 0,
      result: {
        severity: 'error',
        formatted: ''
      }
    })

    await expect(runCommand('--lint'))
      .rejects
      .toMatchInlineSnapshot('[Error: process.exit called with 1]')

    expect(lint.runEslint).toHaveBeenCalledTimes(1)
    expectToBeCalled(0)
  })

  test(`${commandName} should copy the manifest if there are no errors`, async () => {
    await runCommand()
    expectToBeCalled(1)
    expect(fs.copyFile).toHaveBeenCalledTimes(1)
  })
}