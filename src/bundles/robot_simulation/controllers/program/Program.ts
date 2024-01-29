import { type IOptions, runECEvaluatorByJoel } from 'js-slang';
import context from 'js-slang/context';
import { type FrameTimingInfo, type Controller } from '../../engine';
import { CallbackHandler } from '../../engine/Core/CallbackHandler';


export class Program implements Controller {
  code: string;
  iterator: Generator | null;
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

    this.iterator = runECEvaluatorByJoel(this.code, context, options);
  }

  fixedUpdate(_: number) {
    if (this.isPaused) {
      return;
    }
    for (let i = 0; i < 4; i++) {
      this.iterator!.next();
    }
  }

  update(frameTiming: FrameTimingInfo): void {
    this.callbackHandler.checkCallbacks(frameTiming);
  }
}
