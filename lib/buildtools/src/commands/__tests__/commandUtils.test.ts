import type { Severity } from '@sourceacademy/modules-repotools/types';
import { describe, expect, test } from 'vitest';
import { processResult } from '../commandUtils.js';

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
