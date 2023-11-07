import { type Steppable } from '../types';

export type TimeoutFunction = () => void;

export class TimeController implements Steppable {
  startTime:number | null;
  pauseTime:number | null; // Time of the last pause
  pausedTime: number; // Total time spent paused
  isPaused:boolean;
  elapsedTime:number;
  timeoutCallbacks:Array<{ callback:TimeoutFunction, simulatedTime: number }>;

  constructor() {
    this.startTime = null;
    this.pauseTime = null;
    this.isPaused = false;
    this.pausedTime = 0;
    this.elapsedTime = 0;
    this.timeoutCallbacks = [];
  }

  hasStarted() {
    return this.startTime !== null;
  }

  getElapsedTime() {
    return this.elapsedTime;
  }

  pause() {
    if (!this.isPaused && this.hasStarted()) {
      this.pauseTime = performance.now();
      this.isPaused = true;
    }
  }

  setTimeout(callback:TimeoutFunction, delay: number) {
    if (!this.hasStarted()) {
      throw new Error('Cannot set timeout before starting simulation');
    }

    const simulatedTime = this.elapsedTime + delay;
    this.timeoutCallbacks.push({
      callback,
      simulatedTime,
    });
  }

  checkTimeouts() {
    if (!this.hasStarted()) {
      return;
    }

    if (this.isPaused) {
      return;
    }

    // Filter out expired timeouts
    // Could be done with a priority queue but this is simpler
    const expiredTimeouts = this.timeoutCallbacks.filter((timeout) => timeout.simulatedTime <= this.elapsedTime);
    for (const expiredTimeout of expiredTimeouts) {
      const index = this.timeoutCallbacks.indexOf(expiredTimeout);
      if (index !== -1) {
        this.timeoutCallbacks.splice(index, 1);
        expiredTimeout.callback();
      }
    }
  }

  step(timestamp:number):void {
    // First step called
    if (this.startTime === null) {
      this.startTime = timestamp;
    }

    // If paused,
    if (this.isPaused && this.pauseTime !== null) {
      // Update paused time
      this.pausedTime += timestamp - this.pauseTime;
      // unpause
      this.pauseTime = null;
      this.isPaused = false;
    }

    // Not paused, so update elapsed time
    this.elapsedTime = timestamp - this.startTime - this.pausedTime;
    this.checkTimeouts();
  }
}
