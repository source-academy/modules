import { createElement } from 'react';
import { afterEach, beforeEach, expect, test as baseTest, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useAnimation, type AnimationOptions } from '../useAnimation';

interface Fixtures {
  callback: (timestamp: number, canvas: HTMLCanvasElement) => void;
  canvas: HTMLCanvasElement;
}

const test = baseTest.extend<Fixtures>(
  {
    callback: ({ }, use) => use(vi.fn()),
    canvas: ({ }, use) => use(createElement('canvas') as unknown as HTMLCanvasElement)
  }
);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

async function getAnimationHook(
  options: AnimationOptions,
  canvas: HTMLCanvasElement
) {
  const { result, act } = await renderHook(() => useAnimation(options));

  await act(() => {
    result.current.setCanvas(canvas);
  });

  return {
    hook: result,
    act,
    advanceFrames(count: number) {
      return act(() => {
        for (let i = 0; i < count; i++) {
          vi.advanceTimersToNextFrame();
        }
      });
    }
  };
}

test('First frame is automatically drawn', async ({ callback, canvas }) => {
  await getAnimationHook({ callback }, canvas);
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenCalledWith(0, expect.anything());
});

test('Animation should automatically restart if autoLoop is true', async ({ callback, canvas }) => {
  const { hook, act, advanceFrames } = await getAnimationHook({
    autoLoop: true,
    animationDuration: 1000,
    callback
  }, canvas);

  await act(() => {
    hook.current.start();
    hook.current.changeTimestamp(999);
  });

  await advanceFrames(4);

  expect(callback).toHaveBeenCalledTimes(5);
  const [[frame0], [frame1], [frame2], [frame3], [frame4]] = vi.mocked(callback).mock.calls;
  // Once at the start
  expect(frame0).toEqual(0);
  // Once for 999 timestamp
  expect(frame1).toEqual(999);
  // Once for when the animation completes
  expect(frame2).toEqual(1000);
  // Once for the 0 after reset
  expect(frame3).toEqual(0);
  // Once for the frame after
  expect(frame4).toBeGreaterThan(0);
});

test('Animation should stop if autoLoop is false', async ({ callback, canvas }) => {
  const { hook, act, advanceFrames } = await getAnimationHook({
    autoLoop: false,
    animationDuration: 1000,
    callback
  }, canvas);

  await act(() => {
    hook.current.start();
    hook.current.changeTimestamp(999);
  });

  expect(hook.current.isPlaying).toEqual(true);
  await advanceFrames(3);

  expect(callback).toHaveBeenCalledTimes(3);
  const [[frame0], [frame1], [frame2]] = vi.mocked(callback).mock.calls;
  expect(frame0).toEqual(0);
  expect(frame1).toEqual(999);
  expect(frame2).toEqual(1000);

  expect(hook.current.isPlaying).toEqual(false);
});

test('Animation should auto start if autoStart is true', async ({ callback, canvas }) => {
  const { hook, advanceFrames } = await getAnimationHook({
    autoLoop: false,
    autoStart: true,
    animationDuration: 1000,
    callback,
  }, canvas);

  await advanceFrames(10);

  expect(callback).toHaveBeenCalledTimes(10);
  expect(hook.current.isPlaying).toEqual(true);
});

test('Animation should not auto start if autoStart is false', async ({ callback, canvas }) => {
  const { hook, advanceFrames } = await getAnimationHook({
    autoLoop: false,
    autoStart: false,
    animationDuration: 1000,
    callback,
  }, canvas);
  await advanceFrames(10);

  expect(callback).toHaveBeenCalledTimes(1);
  expect(hook.current.isPlaying).toEqual(false);
});

test('animation reset', async ({ callback, canvas }) => {
  const { hook, act, advanceFrames } = await getAnimationHook({
    autoLoop: false,
    animationDuration: 1000,
    callback,
  }, canvas);

  await act(() => {
    hook.current.start();
  });

  expect(hook.current.isPlaying).toEqual(true);
  await advanceFrames(1);

  await act(() => {
    hook.current.reset();
  });

  expect(hook.current.timestamp).toEqual(0);
  // If it was playing before, reset shouldn't stop it from playing
  expect(hook.current.isPlaying).toEqual(true);
});

test('Hook correctly respects framerate', async ({ callback, canvas }) => {
  const { advanceFrames } = await getAnimationHook({
    autoStart: true,
    frameDuration: 100,
    animationDuration: 1000,
    callback
  }, canvas);

  await advanceFrames(160);
  expect(callback).toHaveBeenCalledTimes(10);
});
