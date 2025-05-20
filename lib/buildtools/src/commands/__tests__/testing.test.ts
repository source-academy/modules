import type { MockedFunction } from 'jest-mock';
import getTestCommand from '../testing';
import { runJest } from '../../testing/runner';

jest.mock('../../testing/runner', () => ({
  runJest: jest.fn()
}))

const runCommand = (...args: string[]) => getTestCommand()
  .parseAsync(args, { from: 'user' });
const mockRunJest = runJest as MockedFunction<typeof runJest>;

test('Check that the test command properly passes options to jest', async () => {
  await runCommand('-u', '0', '-w', './src/folder');

  expect(runJest).toHaveBeenCalledTimes(1)

  const [[args, patterns]] = mockRunJest.mock.calls;
  expect(args)
    .toEqual(['-u', '0']);
  expect(patterns)
    .toEqual(['-w', './src/folder']);
});

test('Check that the test command handles windows paths as posix paths', async () => {
  await runCommand('.\\src\\folder');
  expect(runJest).toHaveBeenCalledTimes(1)

  const [call] = mockRunJest.mock.calls;
  expect(call[0])
    .toEqual(['./src/folder']);
});
