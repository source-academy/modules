import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { expect, test } from 'vitest';
import { Painter } from '..';

test('painter tab', () => {
  const context = mockDebuggerContext({ drawnPainters: [] }, 'painter');
  expect(<Painter context={context} />).toMatchSnapshot();
});
