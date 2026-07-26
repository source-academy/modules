import { DataType } from '@sourceacademy/conductor/types';
import { TestDataHandler, numberValue, runAsyncGenerator, stringValue } from '@sourceacademy/modules-testplugin';
import { describe, expect, it } from 'vitest';
import { generatePlot } from '../curve_functions';
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

  it('serialises integers', async () => {
    const handler = new TestDataHandler();
    const data = {};
    const sourceData = await handler.list(
      await handler.pair_make(stringValue('x'), { type: DataType.INTEGER, value: 1 })
    );

    await funcs.add_fields_to_data(handler, data, sourceData);

    expect(data).toHaveProperty('x', 1);
  });
});

describe(generatePlot, () => {
  it('uses a Point created by a separate bundle', async () => {
    const handler = new TestDataHandler();
    const curve = await handler.closure_make(
      {
        args: [DataType.NUMBER] as const,
        returnType: DataType.OPAQUE
      },
      async function* () {
        return await handler.opaque_make({
          x: 1,
          y: 2,
          z: 3,
          color: [1, 0.5, 0, 1],
          toReplString: () => '(1, 2, 3, Color: 1,0.5,0,1)'
        });
      }
    );

    const plot = await runAsyncGenerator(generatePlot(
      handler,
      'scatter',
      1,
      {},
      {},
      true,
      curve
    ));

    expect(plot.toSerialized().data).toMatchObject({
      x: [1, 1],
      y: [2, 2],
      z: [3, 3],
      marker: {
        color: ['rgb(255,127,0)', 'rgb(255,127,0)']
      }
    });
  });
});
