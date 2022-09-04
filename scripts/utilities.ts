/**
 * Utilities for scripts
 */
import chalk from 'chalk';
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

export type CommandInfo = {
  name: string;
  description: string;
  helpText: string | string[];
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
) => {
  const helpText = `${(typeof info.helpText === 'string' ? [info.helpText] : info.helpText).join('\n')}\n`;

  return info.options.reduce((cmd, { optionStrs, help }) => {
    if (typeof optionStrs === 'string') {
      optionStrs = [optionStrs];
    }
    return cmd.option(optionStrs.join(', '), help);
  },
  new Command(info.name)
    .description(chalk.greenBright(info.description))
    .addHelpText('after', chalk.yellow(helpText)))
    .action(handler);
};

export class Logger {
  private logs: string[] = [];

  public get contents() {
    return this.logs;
  }

  public reset() { this.logs = []; }

  public printToConsole() {
    console.log(this.contents.join('\n'));
    this.reset();
  }

  public log(str: string) {
    this.logs.push(str);
  }
}
