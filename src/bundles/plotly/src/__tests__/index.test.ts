import { TestDataHandler, numberValue, stringValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, it } from 'vitest';
import * as funcs from '../functions';

describe(funcs.add_fields_to_data, () => {
  it('works', async () => {
    const handler = new TestDataHandler();
    const data = {};
    const sourceData = await handler.list(
      await handler.pair_make(stringValue('x'), numberValue(0)),
      await handler.pair_make(stringValue('y'), numberValue(1)),
      await handler.pair_make(stringValue('z'), numberValue(2))
    );
    await funcs.add_fields_to_data(handler, data, sourceData);

    expect(data).toHaveProperty('x', 0);
    expect(data).toHaveProperty('y', 1);
    expect(data).toHaveProperty('z', 2);
  });
});
