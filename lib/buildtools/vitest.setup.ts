// Buildtools vitest setup
import { vi } from 'vitest';

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

vi.mock('fs/promises', () => ({
  default: {
    copyFile: vi.fn(() => Promise.resolve()),
    cp: vi.fn(() => Promise.resolve()),
    open: vi.fn(),
    mkdir: vi.fn(() => Promise.resolve()),
    writeFile: vi.fn(() => Promise.resolve()),
  }
}));

vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`process.exit called with ${code}`);
});

vi.mock('lodash', async importOriginal => {
  const lodash: any = await importOriginal();

  return {
    default: {
      ...lodash,
      memoize: x => x
    }
  };
});
