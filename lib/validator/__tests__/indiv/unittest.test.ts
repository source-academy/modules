import type * as funcs from '@sourceacademy/bundle-unittest';
import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import partialBundle from '#bundle/unittest';
import partialTab from '#tab/Unittest';
import { getTestFunc } from '../utils';

const test = getTestFunc<typeof funcs>('unittest', partialBundle, partialTab);

describe('Unittest bundle and repl', () => {
  test('tab won\'t spawn if no tests', ({ context, tab: { toSpawn } }) => {
    expect(toSpawn!(context)).toEqual(false);
  });

  test('tab will spawn with unittest', async ({ context, tab, bundle }) => {
    bundle.describe('suite', () => {
      bundle.test('test0', () => {
        bundle.assert(() => false);
      });
    });

    expect(tab.toSpawn!(context)).toEqual(true);

    await render(tab.body(context));
  });
});
