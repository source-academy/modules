import { type IOptions } from 'js-slang';
import context from 'js-slang/context';
import type { DeepPartial } from '../../../../common/deepPartial';
import { type Controller } from '../../engine';
import { CallbackHandler } from '../../engine/Core/CallbackHandler';
import type { PhysicsTimingInfo } from '../../engine/Physics';
import { mergeConfig } from '../utils/mergeConfig';
import { ProgramError } from './error';
import { runECEvaluator } from './evaluate';

type ProgramConfig = {
  stepsPerTick: number;
};

const defaultProgramConfig: ProgramConfig = {
  stepsPerTick: 11,
};

export const program_controller_identifier = 'program_controller';

export class Program implements Controller {
  code: string;
  iterator: ReturnType<typeof runECEvaluator> | null;
  isPaused: boolean;
  callbackHandler = new CallbackHandler();
  name: string;
  config: ProgramConfig;

  constructor(code: string, config?: DeepPartial<ProgramConfig>) {
    this.config = mergeConfig(defaultProgramConfig, config);
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
      for (let i = 0; i < this.config.stepsPerTick; i++) {
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
