/* eslint-disable @typescript-eslint/no-unused-vars */
import { animate_3D_curve, animate_curve, draw_3D_connected, draw_connected } from '@sourceacademy/bundle-curve';
import type { CurveModuleState } from '@sourceacademy/bundle-curve/types';
import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { expect, test } from 'vitest';
import { CurveTab } from '..';

test('Curve animations error gracefully', () => {
  const badAnimation = animate_curve(1, 60, draw_connected(200), t => 1 as any);
  const mockContext = mockDebuggerContext<CurveModuleState>({ drawnCurves: [badAnimation] }, 'curve');
  expect(<CurveTab context={mockContext} />)
    .toMatchSnapshot();
});

test('Curve 3D animations error gracefully', () => {
  const badAnimation = animate_3D_curve(1, 60, draw_3D_connected(200), t => 1 as any);
  const mockContext = mockDebuggerContext<CurveModuleState>({ drawnCurves: [badAnimation] }, 'curve');
  expect(<CurveTab context={mockContext} />)
    .toMatchSnapshot();
});
