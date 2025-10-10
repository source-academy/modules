import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { expect, test } from 'vitest';
import { Plotly } from '..';

test('plotly tab', () => {
  const context = mockDebuggerContext({}, 'plotly');
  expect(<Plotly context={context} />).toMatchSnapshot();
});
