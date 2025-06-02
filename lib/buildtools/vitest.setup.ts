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

vi.mock(import('fs/promises'));

vi.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`process.exit called with ${code}`);
});
