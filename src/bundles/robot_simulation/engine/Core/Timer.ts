export type FrameTimingInfo = {
  elapsedTimeReal: number;
  elapsedTimeSimulated: number;
  frameDuration: number;
  framesPerSecond: number;
};

export class Timer {
  private _isRunning = false;
  private _elapsedSimulatedTime = 0;
  private _timeSpentPaused = 0;
  private _frameDuration = 0;


  private _startTime: number | null = null;
  private _pausedAt: number | null = null;
  private _currentTime: number | null = null;

  /**
     * Pauses the timer and marks the pause time.
     */
  pause(): void {
    if (this._currentTime === null) {
      return;
    }

    if (this._isRunning) {
      this._isRunning = false;
      this._pausedAt = this._currentTime;
    }
  }

  /**
     * Steps the timer forward, calculates frame timing info.
     * @param timestamp - The current timestamp.
     * @returns The frame timing information.
     */
  step(timestamp: number): FrameTimingInfo {
    if (this._startTime === null) {
      this._startTime = timestamp;
    }

    if (!this._isRunning) {
      this._isRunning = true;
    }

    if (this._pausedAt !== null) {
      this._timeSpentPaused += timestamp - this._pausedAt;
      this._pausedAt = null;
    }

    this._frameDuration = this._currentTime ? timestamp - this._currentTime : 0;
    this._currentTime = timestamp;

    this._elapsedSimulatedTime = timestamp - this._startTime - this._timeSpentPaused;

    return {
      elapsedTimeReal: this._currentTime - this._startTime,
      elapsedTimeSimulated: this._elapsedSimulatedTime,
      frameDuration: this._frameDuration,
      framesPerSecond: 1000 / this._frameDuration,
    };
  }
}
