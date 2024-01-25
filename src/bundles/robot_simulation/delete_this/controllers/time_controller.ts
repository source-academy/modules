import { type Steppable } from '../types';

export type TimeoutCallback = () => void;

export class TimeController implements Steppable {
  private startTime: number | null;
  private pauseTime: number | null; // Time when the last pause occurred
  private totalPausedTime: number; // Total duration of pauses
  private isPaused: boolean;
  private elapsedTime: number; // Time since start excluding paused durations
  private timeoutEvents: Array<{ callback: TimeoutCallback; triggerTime: number }>;
  private deltaTime: number; // Time difference between the current and last step

  constructor() {
    this.startTime = null;
    this.pauseTime = null;
    this.isPaused = false;
    this.totalPausedTime = 0;
    this.elapsedTime = 0;
    this.timeoutEvents = [];
    this.deltaTime = 0;
  }

  // Check if the simulation has started
  hasStarted(): boolean {
    return this.startTime !== null;
  }

  // Get the total elapsed time excluding paused durations
  getElapsedTime(): number {
    return this.elapsedTime;
  }

  getDeltaTime(): number {
    return this.deltaTime;
  }

  // Pause the simulation
  pause(): void {
    if (!this.isPaused && this.hasStarted()) {
      this.pauseTime = performance.now();
      this.isPaused = true;
    }
  }

  // Schedule a callback function to execute after a delay
  setTimeout(callback: TimeoutCallback, delay: number): void {
    if (!this.hasStarted()) {
      throw new Error('Cannot set timeout before starting simulation');
    }

    const triggerTime = this.elapsedTime + delay;
    this.timeoutEvents.push({
      callback,
      triggerTime,
    });
  }

  // Check and execute expired timeout events
  private checkTimeouts(): void {
    if (!this.hasStarted() || this.isPaused) return;

    const currentTime = this.elapsedTime;
    this.timeoutEvents = this.timeoutEvents.filter((timeoutEvent) => {
      if (timeoutEvent.triggerTime <= currentTime) {
        timeoutEvent.callback();
        return false; // Remove from the array
      }
      return true; // Keep in the array
    });
  }

  // Update the state for each step in the simulation
  step(timestamp: number): void {
    // Initialize start time on first step
    if (this.startTime === null) {
      this.startTime = timestamp;
    }

    // Resume from pause
    if (this.isPaused && this.pauseTime !== null) {
      this.totalPausedTime += timestamp - this.pauseTime;
      this.pauseTime = null;
      this.isPaused = false;
    }


    // Update elapsed and delta time
    const new_elapsed_time = timestamp - this.startTime - this.totalPausedTime;
    this.deltaTime = new_elapsed_time - this.elapsedTime;
    this.elapsedTime = new_elapsed_time;

    // Process timeout events
    this.checkTimeouts();
  }
}
