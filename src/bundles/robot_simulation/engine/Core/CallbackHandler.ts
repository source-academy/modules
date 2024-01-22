import { type FrameTimingInfo } from './Timer';

export type TimeoutCallback = () => void;

export class CallbackHandler {
  callbackStore: Array<{ callback: TimeoutCallback; triggerTime: number }>;
  currentTime: number;

  constructor() {
    this.callbackStore = [];
    this.currentTime = 0;
  }

  addCallback(callback: TimeoutCallback, delay: number): void {
    const triggerTime = this.currentTime + delay;
    this.callbackStore.push({
      callback,
      triggerTime,
    });
  }

  checkCallbacks(frameTimingInfo: FrameTimingInfo): void {
    this.currentTime = frameTimingInfo.elapsedTimeSimulated;

    this.callbackStore = this.callbackStore.filter((timeoutEvent) => {
      if (timeoutEvent.triggerTime <= this.currentTime) {
        timeoutEvent.callback();
        return false; // Remove from the array
      }
      return true; // Keep in the array
    });
  }
}
