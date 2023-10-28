import type { MockedFunction } from 'jest-mock';
import * as runner from '../runner'
import getTestCommand from '..'

jest.spyOn(runner, 'runJest').mockImplementation(jest.fn())

const runCommand = (...args: string[]) => getTestCommand().parseAsync(args, { from: 'user' })
const mockRunJest = runner.runJest as MockedFunction<typeof runner.runJest>

test('Check that the test command properly passes options to jest', async () => {
  await runCommand('-u', '-w', '--srcDir', 'gg', './src/folder')

  const [call] = mockRunJest.mock.calls
  expect(call[0]).toEqual(['-u', '-w', './src/folder'])
  expect(call[1]).toEqual('gg');
})

test('Check that the test command handles windows paths as posix paths', async () => {
  await runCommand('.\\src\\folder')

  const [call] = mockRunJest.mock.calls
  expect(call[0]).toEqual(['./src/folder'])
})