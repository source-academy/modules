/* eslint-disable react-hooks/rules-of-hooks */
import { animate_3D_curve, draw_3D_connected, make_3D_point } from '@sourceacademy/bundle-curve';
import type { Curve, CurveDrawn } from '@sourceacademy/bundle-curve/curves_webgl';
import type { AnimatedCurve } from '@sourceacademy/bundle-curve/types';
import { degreesToRadians } from '@sourceacademy/modules-lib/utilities';
import { userEvent } from '@vitest/browser/context';
import { afterEach, beforeEach, describe, expect, test as baseTest, vi, type MockedFunction } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import Canvas3DCurve from '../canvas_3d_curve';
import Curve3DAnimationCanvas from '../curve_3d_animation_canvas';

afterEach(() => {
  cleanup();
});

describe('Test 3D Curve Canvas', () => {
  interface Fixtures {
    curve: CurveDrawn;
    mockedRedraw: MockedFunction<(angle: number) => void>;
  };

  const test = baseTest.extend<Fixtures>({
    curve: ({}, use) => {
      return use(draw_3D_connected(400)(t => make_3D_point(t, 0.5 * Math.sin(2 * t * Math.PI), t)));
    },
    mockedRedraw: ({ curve }, use) => {
      const mockedRedraw = vi.fn(curve.redraw.bind(curve));
      curve.redraw = mockedRedraw;
      return use(mockedRedraw);
    }
  });

  test('Setting angle to a valid value using textbox', async ({ curve, mockedRedraw }) => {
    await render(<Canvas3DCurve curve={curve} />);
    await userEvent.keyboard('[Tab][Tab][Tab][Backspace]{10}[Enter]');
    await expect.poll(() => mockedRedraw).toHaveBeenCalledTimes(2);

    const [[call0], [call1]] = mockedRedraw.mock.calls;
    expect(call0).toEqual(0);
    expect(call1).toBeCloseTo(degreesToRadians(10));
  });

  test('Setting angle to less than 0 using textbox sets it to 0', async ({ curve, mockedRedraw }) => {
    await render(<Canvas3DCurve curve={curve} />);
    await userEvent.keyboard('[Tab][Tab][Tab][Backspace]{-}{1}[Enter]');
    await expect.poll(() => mockedRedraw).toHaveBeenCalledTimes(2);

    const [[call0], [call1]] = mockedRedraw.mock.calls;
    expect(call0).toEqual(0);
    expect(call1).toEqual(0);
  });

  test('Setting angle to greater than 360 using textbox sets it to 360', async ({ curve, mockedRedraw }) => {
    await render(<Canvas3DCurve curve={curve} />);
    await userEvent.keyboard('[Tab][Tab][Tab][Backspace]400[Enter]');
    await expect.poll(() => mockedRedraw).toHaveBeenCalledTimes(2);

    const [[call0], [call1]] = mockedRedraw.mock.calls;
    expect(call0).toEqual(0);
    expect(call1).toBeCloseTo(2 * Math.PI);
  });

  test('Clearing the value from the textbox doesn\'t change the angle', async ({ curve, mockedRedraw }) => {
    await render(<Canvas3DCurve curve={curve} />);
    await userEvent.keyboard('[Tab][Tab][Tab][Backspace][Enter]');
    await expect.poll(() => mockedRedraw).toHaveBeenCalledExactlyOnceWith(0);
  });

  test('Play button actually automatically rotates the viewpoint', async ({ curve, mockedRedraw }) => {
    vi.useFakeTimers();

    try {
      const screen = await render(<Canvas3DCurve curve={curve} />);
      const playButton = screen.getByTitle('PlayButton');
      await playButton.click();

      // The animation lasts for 72 seconds. Vitest simulates a requestAnimationFrame every 16ms
      // so it should take 450 calls to rotate 360 degrees, then 1 more call to return to 0 degrees
      for (let i = 0; i < 451; i++) {
        vi.advanceTimersToNextFrame();
      }

      // 1 extra redraw call is expected to account for when the animation resets
      await expect.poll(() => mockedRedraw).toHaveBeenCalledTimes(452);
      const [[call450], [call451]] = mockedRedraw.mock.calls.slice(450);

      // The last call should be around 2 PI radians
      expect(call450).toBeCloseTo(2 * Math.PI);
      // The next call should have returned to 0 radians
      expect(call451).toEqual(0);
    } finally {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    }
  });
});

describe('Test 3D Animated Curve Canvas', () => {
  interface Fixtures {
    curve: AnimatedCurve;
    mockAngleRedraw: MockedFunction<(angle: number) => void>;
    mockGetFrame: MockedFunction<(timestamp: number) => void>;
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  const test = baseTest.extend<Fixtures>({
    mockAngleRedraw: ({}, use) => use(vi.fn((_angle: number) => {})),
    mockGetFrame: ({}, use) => use(vi.fn((_timestamp: number) => {})),
    curve: ({ mockAngleRedraw, mockGetFrame }, use) => {
      const drawer = draw_3D_connected(400);
      /**
       * A mocked implementation of draw_3D_connected that allows us to spy
       * on what angle the curves were drawn with
       */
      function mockDrawer(curve: Curve) {
        const drawnCurve = drawer(curve);
        const oldRedraw = drawnCurve.redraw.bind(drawnCurve);
        drawnCurve.redraw = angle => {
          mockAngleRedraw(angle);
          return oldRedraw(angle);
        };
        return drawnCurve;
      };
      mockDrawer.is3D = true;
      mockDrawer.toReplString = () => '';

      const animation = animate_3D_curve(1, 10, mockDrawer, c => t => make_3D_point(t, 0.5 * Math.sin((2 * t + c) * Math.PI), t));

      // Now we also mock the implementation of getFrame to allow us to see what frames were drawn
      const oldGetFrame = animation.getFrame.bind(animation);
      animation.getFrame = timestamp => {
        mockGetFrame(timestamp);
        return oldGetFrame(timestamp);
      };

      return use(animation);
    },
  });

  test('Clicking play button runs through the entire animation', async ({ curve, mockAngleRedraw, mockGetFrame }) => {
    const screen = await render(<Curve3DAnimationCanvas animation={curve} />);
    const playButton = screen.getByTitle('PlayButton');
    const autoPlaySwitch = screen.getByRole('checkbox');
    await autoPlaySwitch.click();
    await playButton.click();

    // Exactly enough time for 10 frames to be drawn
    for (let i = 0; i < 64; i++) {
      vi.advanceTimersToNextFrame();
    }

    await expect.poll(() => mockAngleRedraw).toHaveBeenCalledTimes(10);
    // Since we never changed the angle, all calls should have been called with angle 0
    mockAngleRedraw.mock.calls.forEach(([angle]) => expect(angle).toEqual(0));

    // Check that all 10 frames were drawn
    expect(mockGetFrame).toHaveBeenCalledTimes(10);
    for (let i = 0; i < 9; i++) {
      expect(mockGetFrame.mock.calls[i][0]).toBeCloseTo(i * 0.112);
    }
    expect(mockGetFrame.mock.calls[9][0]).toEqual(1);
  });

  test('Changing the angle', async ({ curve, mockAngleRedraw, mockGetFrame }) => {
    curve.angle = Math.PI;
    const screen = await render(<Curve3DAnimationCanvas animation={curve} />);

    const playButton = screen.getByTitle('PlayButton');
    const autoPlaySwitch = screen.getByRole('checkbox');
    await autoPlaySwitch.click();
    await playButton.click();

    // Exactly enough time for 10 frames to be drawn
    for (let i = 0; i < 64; i++) {
      vi.advanceTimersToNextFrame();
    }

    await expect.poll(() => mockAngleRedraw).toHaveBeenCalledTimes(10);
    // Since we never changed the angle, all calls should have been called with PI
    mockAngleRedraw.mock.calls.forEach(([angle]) => expect(angle).toBeCloseTo(Math.PI));

    // Check that all 10 frames were drawn
    expect(mockGetFrame).toHaveBeenCalledTimes(10);
    for (let i = 0; i < 9; i++) {
      expect(mockGetFrame.mock.calls[i][0]).toBeCloseTo(i * 0.112);
    }
    expect(mockGetFrame.mock.calls[9][0]).toEqual(1);
  });
});
