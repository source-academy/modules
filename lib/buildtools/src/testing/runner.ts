import pathlib from 'path';
import jest from 'jest';

export function runJest(jestArgs: string[], patterns: string[]) {
  const filePatterns = patterns.map(pattern => pattern.split(pathlib.sep).join(pathlib.posix.sep));
  return jest.run([
    ...jestArgs,
    ...filePatterns
  ]);
}
