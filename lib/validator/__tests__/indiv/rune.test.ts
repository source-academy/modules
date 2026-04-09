import type * as funcs from '@sourceacademy/bundle-rune';
import type { RuneModuleState } from '@sourceacademy/bundle-rune/functions';
import { getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import partialBundle from '#bundle/rune';
import partialTab from '#tab/Rune';
import { getTestFunc } from '../utils';

const test = getTestFunc<typeof funcs>('rune', partialBundle, partialTab);

describe('Rune bundle and tab', () => {
  test('empty drawn runes should not spawn', ({ context, tab: { toSpawn } }) => {
    expect(toSpawn!(context)).toEqual(false);
  });

  test('draw single normal rune', async ({ context, bundle, tab }) => {
    bundle.show(bundle.heart);

    const { drawnRunes } = getModuleState<RuneModuleState>(context, 'rune')!;
    expect(drawnRunes.length).toEqual(1);

    expect(tab.toSpawn!(context)).toEqual(true);

    await render(tab.body(context));
  });
});
