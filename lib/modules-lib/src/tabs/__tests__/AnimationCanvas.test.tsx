import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-react';
import type { glAnimation } from '../../types';
import AnimationCanvas from '../AnimationCanvas';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
  cleanup();
});

test('Animations are played entirely and stops', async () => {
  const testFrame = vi.fn();

  const testAnimation: glAnimation = {
    duration: 1,
    fps: 10,
    getFrame(timestamp) {
      return {
        draw: () => {
          testFrame(timestamp);
          // const context = canvas.getContext("2d");
          // context!.fillStyle = 'green';
          // context?.fillRect(10, 10, 100, 100);
        }
      };
    },
  };
  const component = await render(<AnimationCanvas animation={testAnimation} />);

  const playButton = component.getByTitle('PlayButton');
  const autoLoopSwitch = component.getByRole('checkbox');

  await autoLoopSwitch.click();
  await playButton.click();

  for (let i = 0; i < 160; i++) {
    vi.advanceTimersToNextFrame();
  }

  await expect.poll(() => testFrame).toHaveBeenCalledTimes(10);

  // call 0 occurs when the first frame is drawn to the canvas
  // to fill the canvas when the animation hasn't started playing
  const { calls } = testFrame.mock;
  expect(calls[0][0]).toEqual(0);
  expect(calls[calls.length-1][0]).toEqual(1);
});

test('Gracefully handles animations that error halfway through and can be restarted', async () => {
  const testFrame = vi.fn((timestamp: number) => {
    return {
      draw: () => {
        if (timestamp > 0.5) throw new Error('Oh no!');
      }
    };
  });

  const errorAnimation: glAnimation = {
    duration: 1,
    fps: 10,
    getFrame: testFrame
  };

  const component = await render(<AnimationCanvas animation={errorAnimation} />);
  const playButton = component.getByTitle('PlayButton');
  await playButton.click();

  for (let i = 0; i < 160; i++) {
    vi.advanceTimersToNextFrame();
  }

  await expect.element(component.getByText('Error: Oh no!')).toBeVisible();
  await expect.poll(() => testFrame).toHaveBeenCalledTimes(6);

  await playButton.click();
  for (let i = 0; i < 160; i++) {
    vi.advanceTimersToNextFrame();
  }

  // Total is 6 + 6
  await expect.poll(() => testFrame).toHaveBeenCalledTimes(12);
  await expect.element(component.getByText('Error: Oh no!')).toBeVisible();
});
