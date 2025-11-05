import fs from 'fs/promises';
import pathlib from 'path';
import { loadConfigFromFile } from 'vite';
import type { TestProjectInlineConfiguration } from 'vitest/config';

/**
 * Try to load a Vitest config from the given directory. If it doesn't exist, then return `null`.
 *
 * It will search for the following files in the given order:
 * 1. `vitest.config.ts`
 * 2. `vitest.config.js`
 * 3. `vite.config.ts`
 * 4. `vite.config.js`
 */
export default async function loadVitestConfigFromDir(directory: string) {
  const filesToTry = [
    'vitest.config',
    'vite.config'
  ];

  const extensionsToTry = ['ts', 'js'];

  for (const fileToTry of filesToTry) {
    for (const extToTry of extensionsToTry) {
      try {
        const fullPath = pathlib.join(directory, `${fileToTry}.${extToTry}`);
        await fs.access(fullPath, fs.constants.R_OK);
        const config = await loadConfigFromFile(
          { command: 'build', mode: '' },
          fullPath,
          undefined,
          'silent',
        );

        if (config !== null) return config.config as TestProjectInlineConfiguration;
      } catch { }
    }
  }
  return null;
}
