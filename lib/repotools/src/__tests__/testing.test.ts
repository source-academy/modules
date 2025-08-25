import fs from 'fs/promises';
import { loadConfigFromFile } from 'vite';
import { describe, expect, test, vi } from 'vitest';
import { loadVitestConfigFromDir } from '../testing.js';

vi.mock(import('vite'), async importOriginal => {
  const original = await importOriginal();
  return {
    ...original,
    loadConfigFromFile: vi.fn(original.loadConfigFromFile)
  };
});

vi.spyOn(fs, 'access').mockResolvedValue();

describe(loadVitestConfigFromDir, () => {
  const mockedLoadConfig = vi.mocked(loadConfigFromFile);

  test('returns the config', () => {
    const mockConfig = {
      test: {
        name: 'test'
      }
    };

    mockedLoadConfig.mockResolvedValue({
      config: mockConfig,
      path: '',
      dependencies: []
    });

    return expect(loadVitestConfigFromDir('/dir')).resolves.toBe(mockConfig);
  });

  test('returns null when there are no configs detected', () => {
    mockedLoadConfig.mockRejectedValue(new Error());
    return expect(loadVitestConfigFromDir('/dir')).resolves.toBeNull();
  });
});
