import type { summary } from '@actions/core';
import { vi } from 'vitest';

vi.mock(import('@actions/core'), async importOriginal => {
  const original = await importOriginal();
  const outputObject: Record<string, any> = {};

  const summaryObject: typeof summary = {
    addList() { return this; },
    addHeading() { return this; },
    write() {
      return Promise.resolve(this);
    }
  } as any;

  return {
    ...original,
    info: vi.fn(console.info),
    error: vi.fn(console.error),
    outputObject,
    setOutput: (p, v) => {
      outputObject[p] = JSON.stringify(v);
    },
    summary: summaryObject
  };
});

vi.mock(import('@actions/exec'));
