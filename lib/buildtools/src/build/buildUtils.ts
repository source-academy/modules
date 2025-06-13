import chalk from 'chalk';
import type { ResultEntry } from '../types.js';

export function createBuilder<TArgs extends any[], TResult extends ResultEntry>(
  builder: (outDir: string, ...args: TArgs) => Promise<TResult[]>,
  formatter?: (result: TResult) => string
) {
  return {
    builder,
    formatter: formatter ?? ((result: TResult): string => {
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
