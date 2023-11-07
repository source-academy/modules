import { type IOptions, runECEvaluatorByJoel } from 'js-slang';
import context from 'js-slang/context';
import { type Steppable } from '../types';

import { instance } from '../world';

export class ProgramController implements Steppable {
  #code: string;
  #iterator: Generator | null;
  #isPaused:boolean;

  constructor() {
    this.#code = '';
    this.#iterator = null;
    this.#isPaused = false;
  }

  pause(time: number) {
    this.#isPaused = true;

    instance.setTimeout(() => {
      this.#isPaused = false;
    }, time);
  }

  init(code: string) {
    this.#code = code;

    const options: Partial<IOptions> = {
      originalMaxExecTime: Infinity,
      scheduler: 'preemptive',
      stepLimit: Infinity,
      throwInfiniteLoops: false,
      useSubst: false,
    };

    this.#iterator = runECEvaluatorByJoel(this.#code, context, options);
  }

  step(_: number) {
    if (this.#isPaused) {
      return;
    }
    this.#iterator!.next();
  }
}
