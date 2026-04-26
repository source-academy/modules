import type * as funcs from '@sourceacademy/bundle-sound';
import type { SoundModuleState } from '@sourceacademy/bundle-sound/types';
import { getModuleState } from '@sourceacademy/modules-lib/tabs/utils';
import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import partialBundle from '#bundle/sound';
import partialTab from '#tab/Sound';
import { getTestFunc } from '../utils';

const test = getTestFunc<typeof funcs>('sound', partialBundle, partialTab);

describe('Sound bundle and tab', () => {
  test('empty sounds should not spawn', ({ context, tab: { toSpawn } }) => {
    expect(toSpawn!(context)).toEqual(false);
  });

  test('play a single audio', async ({ context, bundle, tab }) => {
    const sound = bundle.make_sound(_t => 0, 1);
    bundle.play_in_tab(sound);

    const { audioPlayed } = getModuleState<SoundModuleState>(context, 'sound')!;
    expect(audioPlayed.length).toEqual(1);

    expect(tab.toSpawn!(context)).toEqual(true);

    await render(tab.body(context));
  });
});
