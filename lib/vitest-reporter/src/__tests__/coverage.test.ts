import fs from 'fs';
import { describe, expect, it as baseIt, vi } from 'vitest';
import CoverageReporter from '../coverage-reporter.cjs'

vi.spyOn(fs, 'createWriteStream').mockReturnValue({
  write: () => true,
  close: () => {}
} as any);

describe(CoverageReporter, () => {
  const it = baseIt.extend<{ reporter: typeof CoverageReporter }>({
    reporter: new CoverageReporter({})
  });

  it('opens the GITHUB_STEP_SUMMARY file in append mode', ({ reporter }) => {
    try {
      vi.stubEnv('GITHUB_STEP_SUMMARY', 'oh no');
      reporter.onStart({} as any, { watermarks: {} } as any);

      expect(fs.createWriteStream).toHaveBeenCalledExactlyOnceWith(
        'oh no',
        {
          encoding: 'utf-8',
          flags: 'a'
        }
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it.skipIf(!!process.env.GITHUB_STEP_SUMMARY)('doesn\'t open the summary file if GITHUB_STEP_SUMMARY isn\'t defined', ({ reporter }) => {
      reporter.onStart({} as any, { watermarks: {} } as any);
      expect(fs.createWriteStream).not.toHaveBeenCalled();
  });
});
