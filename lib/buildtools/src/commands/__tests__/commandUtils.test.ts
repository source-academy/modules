import { Command } from '@commander-js/extra-typings';
import type { Severity } from '@sourceacademy/modules-repotools/types';
import { LogLevel } from 'typedoc';
import { describe, expect, test } from 'vitest';
import { logLevelOption, processResult } from '../commandUtils.js';

describe(processResult, () => {
  const testCases: [any, Severity][] = [
    [{ severity: 'success' }, 'success'],
    [{ severity: 'error' }, 'error'],
    [
      {
        items: [{ severity: 'error' }, { severity: 'success' }]
      },
      'error'
    ],
    [
      {
        item1: { severity: 'warn' },
        item2: {
          item3: {},
          item4: {
            item5: { severity: 'warn' },
            severity: 'error'
          }
        }
      },
      'error'
    ]
  ];

  test.each(testCases)('%#', (obj, expected) => {
    if (expected === 'error') {
      expect(() => processResult(obj, false)).processExit();
    } else {
      expect(() => processResult(obj, false)).not.processExit();
    }
  });
});

describe('Log Level option', () => {
  async function parseArgs(...args: string[]) {
    return new Promise<LogLevel>((resolve, reject) => {
      new Command()
        .exitOverride(reject)
        .configureOutput({ writeErr: () => { } })
        .addOption(logLevelOption)
        .action(({ logLevel }) => resolve(logLevel))
        .parse(args, { from: 'user' });
    });
  }

  test('no value means LogLevel.Error', () => {
    return expect(parseArgs()).resolves.toEqual(LogLevel.Error);
  });

  test('text values ignores case', () => {
    return expect(parseArgs('--logLevel', 'info')).resolves.toEqual(LogLevel.Info);
  });

  test('number values work', () => {
    return expect(parseArgs('--logLevel', '0')).resolves.toEqual(LogLevel.Verbose);
  });

  test('incorrect numerical value causes error', () => {
    return expect(parseArgs('--logLevel', '10')).rejects.toThrowError('Invalid log level: 10');
  });

  test('incorrect string value causes error', () => {
    return expect(parseArgs('--logLevel', 'infox')).rejects.toThrowError('Invalid log level: infox');
  });
});
