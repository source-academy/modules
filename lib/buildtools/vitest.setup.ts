// Buildtools vitest setup
import pathlib from 'path';
import { isSamePath } from '@sourceacademy/modules-repotools/utils';
import { expect, vi } from 'vitest';

class MockProcessExit extends Error {
  constructor(public readonly code: number) { super(); }

  toString() {
    return `process.exit was called with ${this.code}`;
  }
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
      glob: vi.fn(),
      mkdir: vi.fn().mockResolvedValue(undefined),
      writeFile: vi.fn().mockResolvedValue(undefined),
    }
  };
});

vi.spyOn(process, 'exit').mockImplementation(code => {
  if (typeof code !== 'number') throw new Error(`Expected a numeric code, got ${code}`);
  throw new MockProcessExit(code);
});

vi.mock(import('typescript'), async importOriginal => {
  const { default: original } = await importOriginal();

  return {
    default: {
      ...original,
      sys: {
        ...original.sys,
        writeFile: () => { },
      },
    }
  };
});

vi.mock(import('@sourceacademy/modules-repotools/getGitRoot'), async importOriginal => {
  const { rootVitestConfigPath } = await importOriginal();
  const testMocksDir = pathlib.resolve(import.meta.dirname, '../__test_mocks__');
  return {
    gitRoot: testMocksDir,
    bundlesDir: pathlib.join(testMocksDir, 'src', 'bundles'),
    tabsDir: pathlib.join(testMocksDir, 'src', 'tabs'),
    outDir: '/build',
    // retain the actual path to the root vitest config because we don't have a
    // mocked version
    rootVitestConfigPath
  };
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
      if (error instanceof MockProcessExit) {
        return {
          pass: false,
          message: () => `process.exit was called with ${error.code}`
        };
      }

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
      if (error instanceof MockProcessExit) {
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
  },
  processExit(received: () => any, expected: number = 1) {
    try {
      received();
      return {
        pass: false,
        message: () => `Expected function to call process.exit with code ${expected}`
      };
    } catch (error) {
      if (error instanceof MockProcessExit) {
        return {
          pass: error.code === expected,
          message: () => `process.exit called with ${expected}`
        };
      }
      return {
        pass: false,
        message: () => `Function threw an unexpected error: ${error}`
      };
    }
  },
  toMatchPath(received: string, expected: string) {
    const result = isSamePath(received, expected);
    return {
      pass: result,
      message: () => `${received} ${result ? 'did not resolve' : 'resolved'} to ${expected}`,
    };
  }
});
