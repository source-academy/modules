import { startVitest, type VitestRunMode } from 'vitest/node';
import { objectEntries } from './commands/commandUtils.js';

export interface RunVitestBoolOptions {
  watch?: boolean
  coverage?: boolean
  update?: boolean
}

type ProcessedVitestBoolOptions = Exclude<{
  [K in keyof RunVitestBoolOptions]: `--${K}`
}[keyof RunVitestBoolOptions], undefined>[];

function convertArgsToString(options: RunVitestBoolOptions): ProcessedVitestBoolOptions {
  return objectEntries(options).reduce((res, [key, value]) => !value
    ? res
    : [...res, `--${key}`], [] as ProcessedVitestBoolOptions);
}

export default async function runVitest(mode: VitestRunMode, directory: string, { watch, ...options }: RunVitestBoolOptions) {
  const args: string[] = [
    ...convertArgsToString(options),
    directory,
  ];

  return startVitest(mode, args, { watch });
}
