/**
 * Utilities for scripts
 */
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import _modules from '../modules.json';

export type ModuleManifest = {
  [name: string]: {
    tabs: string[];
  };
};

export const modules = _modules as ModuleManifest;

/**
 * Function to replace the functionality of `__dirname` in CommonJS modules
 */
export const cjsDirname = (url: string) => dirname(fileURLToPath(url));

export async function* asCompleted(promises: Promise<any>[]) {
  /**
   * Named after the C# TaskCompletionSource
   */
  class TCS {
    public isResolved: boolean;

    constructor(
      public readonly promise: Promise<any>,
    ) {
      this.isResolved = false;

      promise
        .catch(() => { this.isResolved = true; })
        .then(() => { this.isResolved = true; });
    }
  }

  const tcs = promises.map((promise) => new TCS(promise));

  while (tcs.length > 0) {
    // eslint-disable-next-line no-await-in-loop
    await Promise.race(tcs.map((each) => each.promise));
    const index = tcs.findIndex((each) => each.isResolved);
    const [toYield] = tcs.splice(index, 1);

    yield toYield.promise;
  }
}

export const testFunc = async () => {
  const sleep = (d: number) => new Promise((r) => setTimeout(r, d));

  const promises = Array.from({ length: 10 }, async (_, i) => {
    const duration = Math.floor(Math.random() * 1000) + 1;
    await sleep(duration);
    return `Task ${i}: Duration: ${duration}ms`;
  });

  for await (const promise of asCompleted(promises)) {
    console.log(await promise);
  }
};
