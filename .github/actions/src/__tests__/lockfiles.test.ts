import { describe, expect, it, vi } from 'vitest';
import * as utils from '../lockfiles.js';

vi.mock(import('../gitRoot.js'), () => ({
  gitRoot: 'root'
}));

describe(utils.extractPackageName, () => {
  it('works with packages that start with @', () => {
    expect(utils.extractPackageName('@sourceacademy/tab-Rune@workspace:^'))
      .toEqual('@sourceacademy/tab-Rune');
  });

  it('works with regular package names', () => {
    expect(utils.extractPackageName('lodash@npm:^4.17.20'))
      .toEqual('lodash');
  });
});
