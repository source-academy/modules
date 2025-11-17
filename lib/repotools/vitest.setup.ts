// Buildtools vitest setup
import pathlib from 'path';
import { vi } from 'vitest';


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

vi.mock(import('./src/getGitRoot.js'), async importOriginal => {
  const { rootVitestConfigPath } = await importOriginal();
  const testMocksDir = pathlib.resolve(import.meta.dirname, '../__test_mocks__');
  return {
    gitRoot: testMocksDir,
    bundlesDir: pathlib.join(testMocksDir, 'bundles'),
    tabsDir: pathlib.join(testMocksDir, 'tabs'),
    outDir: '/build',
    // retain the actual path to the root vitest config because we don't have a
    // mocked version
    rootVitestConfigPath
  };
});
