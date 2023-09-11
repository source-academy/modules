import type { MockedFunction } from 'jest-mock';
import fs from 'fs/promises';
import manifest from '../modules.json';

export const mockSourceModule = (name: string) => {
  const mockedFetch = fetch as MockedFunction<typeof fetch>;
  // First mock for the module manifest
  mockedFetch.mockResolvedValueOnce({
    status: 200,
    json: () => Promise.resolve(manifest),
  } as any);

  // Second mock for documentation
  mockedFetch.mockResolvedValueOnce({
    status: 200,
    async json() {
      const rawDocs = await fs.readFile(`build/jsons/${name}.json`, 'utf-8');
      return JSON.parse(rawDocs);
    },
  } as any);

  // Third mock for the module code
  mockedFetch.mockResolvedValueOnce({
    status: 200,
    text: () => fs.readFile(`build/bundles/${name}.js`, 'utf-8'),
  } as any);
};
