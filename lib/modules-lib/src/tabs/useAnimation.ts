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

  /**
   * Callback that's called to draw each frame
   */
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
  setCanvas: (canvas: HTMLCanvasElement) => void

  /**
   * Callback for manually drawing a frame to the canvas
   * @param timestamp The timestamp to draw. Specify `undefined` to draw
   * the current frame.
   */
  drawFrame: (timestamp?: number) => void;
}

/**
 * Hook that returns a function that causes React to rerender
 * when called.
 */
function useRerender() {
  const [, setRenderer] = useState(true);
  return () => setRenderer(prev => !prev);
}

/**
 * Hook for animations based around the `requestAnimationFrame` function. Calls the provided callback periodically.
 *
 * @param frameDuration Duration of each frame in milliseconds
 * @param animDuration Duration of the entire animation in milliseconds
 * @param autoLoop Should the animation automatically restart after finishing?
 * @param callback Callback that is called with the timestamp of each frame in milliseconds
 * @returns Hook utilities
 */

export function useAnimation({
  animationDuration,
  autoLoop,
  autoStart,
  callback,
  frameDuration,
}: AnimationOptions): AnimationHookResult {
  /*
   * Because we always pass the same instance of animCallback to requestAnimationFrame,
   * values that are returned by useState end up always being stale. So instead, we need
   * to use this weird workaround with passing refs instead.
   *
   * If the value we change needs to trigger a rerender, then we call the rerender function
   * to trick React into doing the rerender.
   */
  const rerender = useRerender();

  /**
   * Keeps track of the requestAnimationFrame request id so
   * that we can cancel it if need be
   */
  const requestIdRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  /**
   * Keeps track of the time when the last frame was drawn
   */
  const lastFrameTimestamp = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoStart ?? false);

  /**
   * Set the current timestamp that the animation is at
   */
  function setElapsed(newVal: number) {
    elapsedRef.current = newVal;
    rerender();
  }

  /**
   * Submit a request to call `animCallback` using `requestAnimationFrame`
   */
  function requestFrame() {
    requestIdRef.current = requestAnimationFrame(animCallback);
  }

  /**
   * Stops the animation by:
   * - Setting `isPlaying` to false
   * - Cancelling the current animation request
   * - Sets the lastFrameTimestamp to null
   */
  function stop() {
    setIsPlaying(false);
    if (requestIdRef.current !== null) {
      cancelAnimationFrame(requestIdRef.current);
      requestIdRef.current = null;
    }
    lastFrameTimestamp.current = null;
  }

  /**
   * Resets the animation to the start but doesn't change `isPlaying`
   * - Sets elapsed to 0 and draws the 0 frame to the canvas
   * - Sets lastFrameTimestamp to null
   * - Cancels the current animation request
   * - If there was a an animation callback scheduled, call `requestFrame` again
   */
  function reset() {
    setElapsed(0);
    callbackWrapper(0);
    lastFrameTimestamp.current = null;
    if (requestIdRef.current !== null) {
      cancelAnimationFrame(requestIdRef.current);
      requestFrame();
    }
  }

  /**
   * Sets `isPlaying` to true and requests an animation frame.
   */
  function start() {
    setIsPlaying(true);
    if (canvasRef.current) requestFrame();
  }

  /**
   * Calls the provided callback with the given timestamp only
   * if the canvas is not null
   */
  function callbackWrapper(time: number) {
    if (canvasRef.current) {
      callback(time, canvasRef.current);
    }
  }

  function animCallback(timeInMs: number) {
    if (lastFrameTimestamp.current === null) {
      // This is the first time the animation is being drawn
      lastFrameTimestamp.current = timeInMs;
      requestFrame();
    } else {
      // Compare with the time since the last frame was drawn
      const diff = timeInMs - lastFrameTimestamp.current;
      const newElapsed = elapsedRef.current + diff;

      if (animationDuration === undefined || newElapsed < animationDuration) {
        requestFrame();
        // If enough time has elapsed since the last frame
        // we can draw the next one
        if (frameDuration === undefined || diff >= frameDuration) {
          setElapsed(newElapsed);
          callbackWrapper(newElapsed);
          lastFrameTimestamp.current = timeInMs;
        };
      } else {
        // If we have exceeded the animation duration, round the elapsed value
        // to the animation duration and call the finish callback
        setElapsed(animationDuration);
        callbackWrapper(animationDuration);
        finishCallbackRef.current!();
        return;
      }
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
    setCanvas: canvas => {
      // No need to do anything with the canvas if the current canvas
      // we're receiving is the same one that we have stored
      if (canvasRef.current !== null && Object.is(canvasRef.current, canvas)) {
        return;
      }

      canvasRef.current = canvas;
      // Draw the current frame of the animation so that the canvas isn't blank
      // after setting the canvas
      callbackWrapper(elapsedRef.current);
      if (isPlaying) {
        requestFrame();
      }
    },
  };
}
