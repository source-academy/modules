import chalk from 'chalk';
import type { ResultEntry } from '../types.js';

/**
 * Type helper for ensuring that build functions and their corresponding
 * results formatter have the correct types
 *
 * @param formatter Function that is called on each result entry returned by the builder, which
 * may or may not return an array of entries
 */
export function createBuilder<TArgs extends any[], TResult extends (ResultEntry | ResultEntry[])>(
  builder: (outDir: string, ...args: TArgs) => Promise<TResult>,
  formatter?: (result: TResult extends Array<infer T> ? T : TResult) => string
) {
  return {
    builder,
    formatter: formatter ?? ((result: TResult extends Array<infer T> ? T : TResult): string => {
      const prefix = 'inputName' in result
        ? chalk.blueBright(`[${result.assetType} ${result.inputName}]`)
        : chalk.blueBright(`[${result.assetType}]`);

      switch (result.severity) {
        case 'error':
          return `${prefix}: ${chalk.redBright(result.message)}`;
        case 'warn':
          return `${prefix}: ${chalk.yellowBright(result.message)}`;
        case 'success':
          return `${prefix}: ${chalk.greenBright(result.message)}`;
      }
    })
  };
}
