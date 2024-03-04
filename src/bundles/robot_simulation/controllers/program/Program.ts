import { type IOptions } from 'js-slang';
import { runECEvaluator } from './evaluate';
import context from 'js-slang/context';
import { type Controller } from '../../engine';
import { CallbackHandler } from '../../engine/Core/CallbackHandler';
import { ProgramError } from './error';
import type { PhysicsTimingInfo } from '../../engine/Physics';

type ProgramConfig = {
  stepsPerTick: number;
};

export const program_controller_identifier = 'program_controller';

export class Program implements Controller {
  code: string;
  iterator: ReturnType<typeof runECEvaluator> | null;
  isPaused: boolean;
  callbackHandler = new CallbackHandler();
  name: string;

  constructor(code: string) {
    this.name = program_controller_identifier;
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

  fixedUpdate() {
    try {
      if (!this.iterator) {
        throw Error('Program not started');
      }

      if (this.isPaused) {
        return;
      }

      // steps per tick
      for (let i = 0; i < 11; i++) {
        const result = this.iterator.next();
      }
    } catch (e) {
      console.error(e);
      throw new ProgramError(
        'Error in program execution. Please check your code and try again.',
      );
    }
  }

  update(frameTiming: PhysicsTimingInfo): void {
    this.callbackHandler.checkCallbacks(frameTiming);
  }
}
