/**
 * Utilities for scripts
 */
import { Command } from 'commander';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import _modules from '../modules.json' assert { type: 'json' };

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

export const objMapper = <TResult extends { [key: string]: any }>(
  vals: [keyof TResult, TResult[keyof TResult]][],
): TResult => vals.reduce((prev, [key, value]) => ({
    ...prev,
    [key]: value,
  }), {}) as TResult;

export type CommandInfo = {
  name: string;
  description: string;
  helpText: string;
  options: {
    optionStrs: string | string[];
    help: string;
  }[];
};

/**
 * Create a `commander` command using a configuration object
 */
export const createCommand = <TOpts>(
  info: CommandInfo,
  handler: (opts: TOpts) => void | Promise<void>,
) => info.options.reduce((cmd, { optionStrs, help }) => {
    if (typeof optionStrs === 'string') optionStrs = [optionStrs];
    return cmd.option(optionStrs.join(', '), help);
  },
  new Command(info.name)
    .description(info.description)
    .addHelpText('beforeAll', info.helpText))
    .action(handler);
