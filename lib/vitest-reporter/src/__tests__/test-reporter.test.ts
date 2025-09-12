import fs from 'fs';
import { describe, expect, it as baseIt, vi } from 'vitest';
import TestReporter from '../test-reporter.js';

vi.spyOn(fs, 'createWriteStream').mockImplementation(() => ({
  write: () => true,
  close: () => {}
} as any));

describe(TestReporter, () => {
  const it = baseIt.extend<{ reporter: TestReporter }>({
    reporter: new TestReporter()
  });

  it('opens the summary file in append mode', ({ reporter }) => {
    try {
      vi.stubEnv('GITHUB_STEP_SUMMARY', 'oh no');
      reporter.onInit();

      expect(fs.createWriteStream).toHaveBeenCalledExactlyOnceWith(
        'oh no',
        { encoding: 'utf-8', flags: 'a' }
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it.skipIf(!!process.env.GITHUB_STEP_SUMMARY)('doesn\'t open the summary file if GITHUB_STEP_SUMMARY isn\'t defined', ({ reporter }) => {
    reporter.onInit();
    expect(fs.createWriteStream).not.toHaveBeenCalled();
  });
});
