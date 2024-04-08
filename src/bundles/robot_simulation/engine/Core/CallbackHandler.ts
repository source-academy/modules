import type { PhysicsTimingInfo } from '../Physics';

export type TimeoutCallback = () => void;
export type CallbackEntry = { callback: TimeoutCallback; delay: number };

export class CallbackHandler {
  callbackStore: Array<CallbackEntry>;
  currentStepCount: number;

  constructor() {
    this.callbackStore = [];
    this.currentStepCount = 0;
  }

  addCallback(callback: TimeoutCallback, delay: number): void {
    this.callbackStore.push({
      callback,
      delay,
    });
  }

  checkCallbacks(frameTimingInfo: PhysicsTimingInfo): void {
    if (frameTimingInfo.stepCount === this.currentStepCount) {
      return;
    }

    this.currentStepCount = frameTimingInfo.stepCount;

    this.callbackStore = this.callbackStore.filter((callbackEntry) => {
      callbackEntry.delay -= frameTimingInfo.timestep;

      if (callbackEntry.delay <= 0) {
        callbackEntry.callback();
        return false;
      }
      return true;
    });
  }
}
