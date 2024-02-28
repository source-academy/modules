import { type IOptions } from 'js-slang';
import { runECEvaluator } from './evaluate';
import context from 'js-slang/context';
import { type FrameTimingInfo, type Controller } from '../../engine';
import { CallbackHandler } from '../../engine/Core/CallbackHandler';

type ProgramConfig = {
  stepsPerTick: number;
};


export class Program implements Controller {
  code: string;
  iterator: ReturnType<typeof runECEvaluator> | null;
  isPaused:boolean;
  callbackHandler = new CallbackHandler();

  constructor(code: string) {
    this.code = code;
    this.iterator = null;
    this.isPaused = false;
  }

  pause(pauseDuration: number) {
    this.isPaused = true;
    this.callbackHandler.addCallback(() => {
      this.isPaused = false;
    }, pauseDuration);
  }

  start() {
    const options: Partial<IOptions> = {
      originalMaxExecTime: Infinity,
      scheduler: 'preemptive',
      stepLimit: Infinity,
      throwInfiniteLoops: false,
      useSubst: false,
    };

    context.errors = [];

    this.iterator = runECEvaluator(this.code, context, options);
  }

  fixedUpdate(_: number) {
    if (!this.iterator) {
      throw Error('Program not started');
    }

    if (this.isPaused) {
      return;
    }

    // steps per tick
    for (let i = 0; i < 10; i++) {
      const result = this.iterator.next();
    }
  }

  update(frameTiming: FrameTimingInfo): void {
    this.callbackHandler.checkCallbacks(frameTiming);
  }
}
