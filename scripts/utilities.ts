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

export const joinArrays = <T>(joiner: T, ...arrays: T[][]): T[] => {
  switch (arrays.length) {
    case 0: return [];
    case 1: return arrays[0];
  }

  const [first, ...others] = arrays;
  return others.reduceRight((each, prev) => [...prev, joiner, ...each], first);
};
