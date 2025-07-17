import { describe, expect, test } from "vitest";
import { Severity } from "../../types.js";
import { processResult } from "../commandUtils.js";

describe('Testing processResults', () => {
  const testCases: [any, Severity][] = [
    [{ severity: Severity.SUCCESS }, Severity.SUCCESS],
    [{ severity: Severity.ERROR }, Severity.ERROR],
    [
      {
        items: [{ severity: Severity.ERROR }, { severity: Severity.SUCCESS }]
      },
      Severity.ERROR
    ],
    [
      {
        item1: { severity: Severity.WARN },
        item2: {
          item3: {},
          item4: {
            item5: { severity: Severity.WARN },
            severity: Severity.ERROR
          }
        }
      },
      Severity.ERROR
    ]
  ];

  test.each(testCases)('%#', (obj, expected) => {
    if (expected === Severity.ERROR) {
      expect(() => processResult(obj, false)).processExit();
    } else {
      expect(() => processResult(obj, false)).not.processExit();
    }
  });
});
