import jest from 'jest';
import pathlib from 'path';

export function runJest(jestArgs: string[], srcDir: string) {
  return jest.run(jestArgs, pathlib.join(srcDir, 'jest.config.js'));
}
