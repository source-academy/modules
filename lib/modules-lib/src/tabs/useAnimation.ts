import { useEffect, useRef, useState } from 'react';

export interface AnimationOptions {
  /**
   * The minimum duration of time between each frame in milliseconds. Because of how
   * `requestAnimationFrame` works, this value isn't respected exactly, but will be
   * around an accurate ballpark
   *
   * Specify `undefined` to execute the callback on every animation frame.
   */
  frameDuration?: number;

  /**
   * Total duration of the animation in milliseconds. Specify `undefined` to have the
   * animation run indefinitely.
   */
  animationDuration?: number;

  /**
   * Automatically go back to the start of the animation when its duration has elapsed.
   * Has no effect if the animation duration is `undefined`.
   */
  autoLoop?: boolean;
  callback: (timestamp: number, canvas: HTMLCanvasElement) => void;

  /**
   * Whether the animation should start playing automatically
   */
  autoStart?: boolean;
}

export interface AnimationHookResult {
  /**
   * Stop the animation
   */
  stop: () => void;

  /**
   * Start the animation
   */
  start: () => void;

  /**
   * Resets the animation to the beginning, but doesn't
   * start it or stop it
   */
  reset: () => void;

  /**
   * Change current timestamp that the animation is at.
   * @param newTime New timestamp to set the animation to in milliseconds
   */
  changeTimestamp: (newTime: number) => void;

  /**
   * Boolean value indicating if the animation is currently playing
   */
  readonly isPlaying: boolean;

  /**
   * Current timestamp of the animation
   */
  readonly timestamp: number;

  /**
   * Pass this ref to the canvas element that will be used to draw
   * the frames
   */
  readonly canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;

  /**
   * Callback for manually drawing a frame to the canvas
   * @param timestamp The timestamp to draw. Specify `undefined` to draw
   * the current frame.
   */
  drawFrame: (timestamp?: number) => void;
}

/**
 * Hook for animations based around the `requestAnimationFrame` function
 * @param frameDuration Duration of each frame in milliseconds
 * @param animDuration Duration of the entire animation in milliseconds
 * @param autoLoop Should the animation automatically restart after finishing?
 * @param callback Callback that is called with the timestamp of each frame in milliseconds
 * @returns Hook utilities
 */

export function useAnimation({ frameDuration, animationDuration, autoLoop, callback, autoStart }: AnimationOptions): AnimationHookResult {
  /*
   * Because we always pass the same instance of animCallback to requestAnimationFrame,
   * values that are returned by useState end up always being stale. So instead, we need
   * to use this weird workaround with passing refs instead.
   *
   * If the value we change needs to trigger a rerender, then we call the rerender function
   * to trick React into doing the rerender.
   */
  const [, setRenderer] = useState(true);
  const rerender = () => setRenderer(prev => !prev);

  /**
   * Keeps track of the requestAnimationFrame request id so
   * that we can cancel it if need be
   */
  const requestIdRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastFrameTimestamp = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Set the current timestamp that the animation is at
   */
  function setElapsed(newVal: number) {
    elapsedRef.current = newVal;
    rerender();
  }

  function stop() {
    setIsPlaying(false);
    if (requestIdRef.current !== null) {
      cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;
    }
    lastFrameTimestamp.current = null;
  }

  function reset() {
    setElapsed(0);
    callbackWrapper(0);
    lastFrameTimestamp.current = null;
    if (requestIdRef.current !== null) {
      cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = requestAnimationFrame(animCallback);
    }
  }

  function start() {
    setIsPlaying(true);
    requestIdRef.current = requestAnimationFrame(animCallback);
  }

  function callbackWrapper(time: number) {
    if (canvasRef.current) {
      callback(time, canvasRef.current);
    }
  }

  function animCallback(timeInMs: number) {
    if (lastFrameTimestamp.current === null) {
      // This is the first time the animation is being drawn
      lastFrameTimestamp.current = timeInMs;
      requestIdRef.current = requestAnimationFrame(animCallback);
    } else {
      // Compare with the time since the last frame was drawn
      const diff = timeInMs - lastFrameTimestamp.current;
      const newElapsed = elapsedRef.current + diff;

      if (animationDuration === undefined || newElapsed < animationDuration) {
        setElapsed(newElapsed);
        requestIdRef.current = requestAnimationFrame(animCallback);
      } else {
        // If we have exceeded the animation duration, round the elapsed value
        // to the animation duration and call the finish callback
        setElapsed(animationDuration);
        if (finishCallbackRef.current) {
          finishCallbackRef.current();
        }
      }

      // If enough time has elapsed since the last frame
      // we can draw the next one
      if (frameDuration === undefined || diff >= frameDuration) {
        callbackWrapper(elapsedRef.current + diff);
        lastFrameTimestamp.current = timeInMs;
      };
    }
  }

  // Again, if we just use useCallback, the animCallback would
  // always have the same instance of the finish callback which would always have
  // the same value of autoLoop
  // So we need to create a new version every time the value of autoLoop changes
  const finishCallbackRef = useRef<null | (() => void)>(null);
  useEffect(() => {
    finishCallbackRef.current = () => {
      if (autoLoop) {
        reset();
      } else {
        stop();
      }
    };
  }, [autoLoop]);

  useEffect(() => {
    // Draw the first frame of the animation so that the canvas isn't blank
    // on the first render
    callbackWrapper(0);

    if (autoStart) start();

    return stop;
  }, []);

  return {
    start,
    stop,
    reset,
    changeTimestamp: newTime => {
      if (newTime < 0 || (animationDuration !== undefined && newTime > animationDuration)) {
        throw new Error(`Invalid timestamp: ${newTime}`);
      }
      setElapsed(newTime);
      callbackWrapper(newTime);
    },
    drawFrame: timestamp => callbackWrapper(timestamp ?? elapsedRef.current),
    isPlaying,
    timestamp: elapsedRef.current,
    canvasRef,
  };
}
