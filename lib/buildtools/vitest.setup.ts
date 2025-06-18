// Buildtools vitest setup
import { expect, vi } from 'vitest';

class MockProcessError extends Error {
  constructor(public readonly code: number) { super(); }
};

vi.mock('chalk', () => {
  const mockChalkFunction = new Proxy((x: string) => x, {
    get: () => mockChalkFunction
  });

  return {
    default: new Proxy({}, {
      get: () => mockChalkFunction
    })
  };
});

vi.mock(import('fs/promises'), async importOriginal => {
  const { default: original } = await importOriginal();
  return {
    default: {
      ...original,
      cp: vi.fn().mockResolvedValue(undefined),
      mkdir: vi.fn().mockResolvedValue(undefined),
      writeFile: vi.fn().mockResolvedValue(undefined),
    }
  };
});

vi.spyOn(process, 'exit').mockImplementation(code => {
  if (typeof code !== 'number') throw new Error(`Expected a numeric code, got ${code}`);
  throw new MockProcessError(code);
});

expect.extend({
  async commandSuccess(received: Promise<any>) {
    try {
      await received;
      return {
        pass: true,
        message: () => 'Command resolved successfully,'
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Command rejected with error ${error}`
      };
    }
  },
  async commandExit(received: Promise<any>, expected: number = 1) {
    try {
      await received;
      return {
        pass: false,
        message: () => `Expected command to exit with code ${expected}, but command resolved`
      };
    } catch (error) {
      if (error instanceof MockProcessError) {
        return {
          pass: error.code === expected,
          message: () => `process.exit called with ${expected}`
        };
      }

      return {
        pass: false,
        message: () => `Command rejected with unexpected error: ${error}`
      };
    }
  }
});
