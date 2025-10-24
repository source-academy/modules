import { animate_anaglyph, animate_rune, blank } from '@sourceacademy/bundle-rune';
import { HollusionRune, type RuneModuleState } from '@sourceacademy/bundle-rune/functions';
import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import RuneSideContent, { RuneTab } from '..';
import HollusionCanvas from '../hollusion_canvas';

test('Ensure that rune animations error gracefully', () => {
  const badAnimation = animate_rune(1, 60, _t => 1 as any);
  const mockContext = mockDebuggerContext<RuneModuleState>({ drawnRunes: [badAnimation] }, 'rune');
  expect(<RuneTab context={mockContext} />)
    .toMatchSnapshot();
});

test('Ensure that anaglyph animations error gracefully', () => {
  const badAnimation = animate_anaglyph(1, 60, _t => 1 as any);
  const mockContext = mockDebuggerContext<RuneModuleState>({ drawnRunes: [badAnimation] }, 'rune');
  expect(<RuneTab context={mockContext} />)
    .toMatchSnapshot();
});

describe(HollusionCanvas, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    cleanup();
  });

  test('Render function is memoized', async () => {
    const rune = new HollusionRune(blank, 0.1);
    const mockedDraw = vi.spyOn(rune, 'draw');

    await render(<HollusionCanvas rune={rune} />);

    for (let i = 0; i < 10; i++) {
      vi.advanceTimersToNextFrame();
    }

    expect(mockedDraw).toHaveBeenCalledOnce();
  });
});

describe('Test Rune Side Content', () => {
  const propertyAccessor = vi.fn(() => ({
    state: {
      drawnRunes: []
    }
  }));

  const contextObject: DebuggerContext = {
    context: {
      moduleContexts: new Proxy({}, {
        get: propertyAccessor
      })
    }
  } as any;

  beforeEach(() => {
    propertyAccessor.mockClear();
  });

  test('toSpawn asks for rune module state', () => {
    RuneSideContent.toSpawn(contextObject);
    expect(propertyAccessor).toHaveBeenCalledExactlyOnceWith(expect.any(Object), 'rune', expect.any(Object));
  });

  test('body asks for rune module state', async () => {
    await render(<RuneSideContent.body {...contextObject} />);
    expect(propertyAccessor).toHaveBeenCalledExactlyOnceWith(expect.any(Object), 'rune', expect.any(Object));
    cleanup();
  });
});
