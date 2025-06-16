import { startVitest, type VitestRunMode } from 'vitest/node';

interface RunVitestBoolOptions {
  watch?: boolean
  coverage?: boolean
  update?: boolean
}

export default async function runVitest(mode: VitestRunMode, directory: string, options: RunVitestBoolOptions) {
  return startVitest(mode, [directory], {
    watch: options.watch,
    update: options.update,
    coverage: {
      enabled: options.coverage
    }
  });
}
