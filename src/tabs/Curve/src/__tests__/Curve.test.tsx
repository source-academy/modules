/* eslint-disable @typescript-eslint/no-unused-vars */
import { animate_3D_curve, animate_curve, draw_3D_connected, draw_connected } from '@sourceacademy/bundle-curve';
import type { CurveModuleState } from '@sourceacademy/bundle-curve/types';
import type { DebuggerContext } from '@sourceacademy/modules-lib/types';
import { mockDebuggerContext } from '@sourceacademy/modules-lib/utilities';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import CurveSideContent, { CurveTab } from '..';

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

describe('Test Curve Side Content', () => {
  const propertyAccessor = vi.fn(() => ({
    state: {
      drawnCurves: []
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

  test('toSpawn asks for curve module state', () => {
    CurveSideContent.toSpawn(contextObject);
    expect(propertyAccessor).toHaveBeenCalledExactlyOnceWith(expect.any(Object), 'curve', expect.any(Object));
  });

  test('body asks for curve module state', () => {
    render(<CurveSideContent.body {...contextObject} />);
    expect(propertyAccessor).toHaveBeenCalledExactlyOnceWith(expect.any(Object), 'curve', expect.any(Object));
  });
});
