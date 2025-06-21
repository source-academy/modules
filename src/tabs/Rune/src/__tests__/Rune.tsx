import { animate_rune } from '@sourceacademy/bundle-rune';
import type { RuneModuleState } from '@sourceacademy/bundle-rune/functions';
import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { expect, test } from 'vitest';
import { RuneTab } from '..';

test('Ensure that rune animations error gracefully', () => {
  const badAnimation = animate_rune(1, 60, _t => 1 as any);
  const mockContext = mockDebuggerContext<RuneModuleState>({ drawnRunes: [badAnimation ]}, 'rune');
  expect(<RuneTab context={mockContext} />)
    .toMatchSnapshot();
});
