import type * as funcs from '@sourceacademy/bundle-curve';
import type { CurveModuleState } from '@sourceacademy/bundle-curve/types';
import { getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import partialBundle from '#bundle/curve';
import partialTab from '#tab/Curve';
import { getTestFunc } from '../utils';

const test = getTestFunc<typeof funcs>('curve', partialBundle, partialTab);

describe('Curve bundle and tab', () => {
  test('empty curves should not spawn', ({ context, tab: { toSpawn } }) => {
    expect(toSpawn!(context)).toEqual(false);
  });

  test('draw single normal curve', async ({ context, bundle, tab }) => {
    bundle.draw_connected(200)(t => bundle.make_point(t, 0.5));

    const { drawnCurves } = getModuleState<CurveModuleState>(context, 'curve')!;
    expect(drawnCurves.length).toEqual(1);

    expect(tab.toSpawn!(context)).toEqual(true);

    await render(tab.body(context));
  });
});
