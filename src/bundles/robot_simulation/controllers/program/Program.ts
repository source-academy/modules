import { type IOptions, runECEvaluatorByJoel } from 'js-slang';
import context from 'js-slang/context';
import { type Controller } from '../../engine';


export class Program implements Controller {
  #code: string;
  #iterator: Generator | null;
  #isPaused:boolean;

  constructor(code: string) {
    this.#code = code;
    this.#iterator = null;
    this.#isPaused = false;
    console.log(code);
  }

  pause(time: number) {
    this.#isPaused = true;
  }

  start() {
    console.log('start');

    const options: Partial<IOptions> = {
      originalMaxExecTime: Infinity,
      scheduler: 'preemptive',
      stepLimit: Infinity,
      throwInfiniteLoops: false,
      useSubst: false,
    };

    context.errors = [];

    this.#iterator = runECEvaluatorByJoel(this.#code, context, options);
  }

  fixedUpdate(_: number) {
    if (this.#isPaused) {
      return;
    }
    const __ = this.#iterator!.next();
  }
}
