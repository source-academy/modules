import { cleanup, render } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { afterAll, describe, expect, test, vi } from "vitest";
import type { glAnimation } from "../../types";
import AnimationCanvas from "../AnimationCanvas";

const testFrame = vi.fn();

const testAnimation: glAnimation = {
  duration: 1,
  fps: 10,
  getFrame(timestamp) {
    return {
      draw: canvas => {
        testFrame(timestamp);
        const context = canvas.getContext("2d");
        context!.fillStyle = 'green';
        context?.fillRect(10, 10, 100, 100);
      }
    };
  },
};

const user = userEvent.setup();

afterAll(() => {
  // cleanup();
});

test('The animation is played entirely', async () => {
  const component = render(<AnimationCanvas animation={testAnimation} />);

  const playButton = component.getByTitle('PlayButton');
  const autoLoopSwitch = component.getByRole('checkbox');

  await user.click(autoLoopSwitch);
  await user.click(playButton);

  await new Promise<void>(resolve => setTimeout(resolve, 1100));

  // Because of the variability in requestAnimationFrame, we may not draw
  // 100% of frames, or we might end up calling the frame draw extra times?
  const { calls } = testFrame.mock;
  expect(calls.length).toBeGreaterThanOrEqual(11);

  // call 0 occurs when the first frame is drawn to the canvas
  // to fill the canvas when the animation hasn't started playing
  expect(calls[0][0]).toEqual(0);

  // so every other call subsequently should start
  // from 0 again
  for (let i = 0; i < 10; i++) {
    const diff = Math.abs(i / 10 - calls[i+1][0]);
    expect(diff).toBeLessThan(0.1);
  }
});

describe.skip('Test error handling', () => {
  const errorAnimation: glAnimation = {
    duration: 1,
    fps: 10,
    getFrame(timestamp) {
      return {
        draw: () => {
          if (timestamp > 0.5) throw new Error('Oh no!');
        }
      };
    }
  };

  const component = render(<AnimationCanvas animation={errorAnimation} />);
  const playButton = component.getByTitle('PlayButton');

  test('Gracefully handles animations that error halfway through', async () => {
    await userEvent.click(playButton);
    await new Promise<void>(resolve => setTimeout(resolve, 600));

    const errorTextElement = component.getByText('Error: Oh no!');
    expect(errorTextElement).not.toBeUndefined();
  });

  test('and the animation can be restarted from there', async () => {
    await userEvent.click(playButton);
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    const errorTextElement = component.getByText('Error: Oh no!');
    expect(errorTextElement).not.toBeUndefined();
  });
});
