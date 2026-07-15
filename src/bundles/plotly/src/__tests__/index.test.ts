import { list, pair } from 'js-slang/dist/stdlib/list';
import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';

describe(funcs.add_fields_to_data, () => {
  it('works', () => {
    const data = {};
    funcs.add_fields_to_data(data, list(
      pair('x', 0),
      pair('y', 1),
      pair('z', 2),
    ));

    expect(data).toHaveProperty('x', 0);
    expect(data).toHaveProperty('y', 1);
    expect(data).toHaveProperty('z', 2);
  });
});
