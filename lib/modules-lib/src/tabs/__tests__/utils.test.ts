import { describe, expect, test } from 'vitest';
import { getModuleState } from '../utils';

describe(getModuleState, () => {
  test('returns null when module isn\'t present on module state', () => {
    const context = {
      context: {
        moduleContexts: {}
      }
    };

    expect(getModuleState(context as any, 'module')).toBeNull();
  });

  test('returns null when module hasn\'t been intialized', () => {
    const context = {
      context: {
        moduleContexts: {
          module: {
            state: null,
            tabs: null
          }
        }
      }
    };

    expect(getModuleState(context as any, 'module')).toBeNull();
  });
});
