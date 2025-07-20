import { describe, expect, test } from "vitest";
import type { Severity } from "../../types.js";
import { processResult } from "../commandUtils.js";

describe('Testing processResults', () => {
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
