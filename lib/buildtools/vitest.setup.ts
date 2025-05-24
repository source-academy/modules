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

vi.mock(import('fs/promises'), async importOriginal => {
  const { default: {
    constants
  }} = await importOriginal();

  return {
    default: {
      constants,
      access: vi.fn(() => Promise.resolve()),
      copyFile: vi.fn(() => Promise.resolve()),
      cp: vi.fn(() => Promise.resolve()),
      mkdir: vi.fn(() => Promise.resolve()),
      open: vi.fn(),
      readFile: vi.fn(),
      writeFile: vi.fn(() => Promise.resolve()),
    }
  } as any;
});

vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`process.exit called with ${code}`);
});
