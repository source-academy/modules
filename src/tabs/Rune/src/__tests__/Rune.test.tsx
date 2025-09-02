import { animate_anaglyph, animate_rune, blank } from '@sourceacademy/bundle-rune';
import { HollusionRune, type RuneModuleState } from '@sourceacademy/bundle-rune/functions';
import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { RuneTab } from '..';
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
  });

  test('Render function is memoized', () => {
    const rune = new HollusionRune(blank, 0.1);
    const mockedDraw = vi.spyOn(rune, 'draw');

    render(<HollusionCanvas rune={rune} />);

    for (let i = 0; i < 10; i++) {
      vi.advanceTimersToNextFrame();
    }

    expect(mockedDraw).toHaveBeenCalledOnce();
  });
});
