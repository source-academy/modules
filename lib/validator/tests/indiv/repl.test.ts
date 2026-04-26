import type * as funcs from '@sourceacademy/bundle-repl';
import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import partialBundle from '#bundle/repl';
import partialTab from '#tab/Repl';
import { getTestFunc } from '../utils';

const it = getTestFunc<typeof funcs>('repl', partialBundle, partialTab);

describe('Repl bundle and tab', () => {
  it.skip('works', async ({ context, bundle: _kept_to_load_bundle, tab }) => {
    console.log(context.context.moduleContexts.repl);
    expect(tab.toSpawn!(context)).toEqual(true);

    await render(tab.body(context));
  });
});
