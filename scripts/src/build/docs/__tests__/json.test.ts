import type { MockedFunction } from "jest-mock";
import { buildJsonCommand, buildJsons } from "..";
import * as jsonModule from '../json';
import fs from 'fs/promises';
import pathlib from 'path';

jest.mock('../../../scriptUtils', () => ({
  ...jest.requireActual('../../../scriptUtils'),
  retrieveManifest: jest.fn((_manifest: string) => Promise.resolve({
    test0: {
      tabs: ['tab0'],
    },
    test1: { tabs: [] },
    test2: {
      tabs: ['tab1'],
    },
  })),
}));

jest.mock('../docUtils');

jest.mock('../../prebuild/tsc', () => ({
  logTscResults: jest.fn(),
  runTsc: jest.fn().mockResolvedValue({ result: {
    severity: 'error',
    results: [],
  }})
}));

jest.mock('fs/promises', () => ({
  copyFile: jest.fn(() => Promise.resolve()),
  mkdir: jest.fn(() => Promise.resolve()),
  stat: jest.fn().mockResolvedValue({ size: 10 }),
  writeFile: jest.fn(() => Promise.resolve()),
}))

// @ts-ignore
jest.spyOn(process, 'exit').mockImplementation(code => code);

jest.spyOn(jsonModule, 'buildJsons');

const runCommand = (...args: string[]) => buildJsonCommand.parseAsync(args, { from: 'user' });
describe('test json command', () => {
  it('should create the output directory', async () => {
    await runCommand();

    expect(fs.mkdir)
      .toBeCalledWith('build', { recursive: true })
  })

  it('should exit with code 1 if tsc returns with an error', async () => {
    await runCommand('--tsc');

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })

  it('should exit with code 1 if buildJsons returns with an error', async () => {
    await runCommand();

    (buildJsons as MockedFunction<typeof buildJsons>).mockResolvedValueOnce([['json', 'test0', { severity: 'error' }]])

    expect(process.exit)
      .toHaveBeenCalledWith(1);
  })
});
