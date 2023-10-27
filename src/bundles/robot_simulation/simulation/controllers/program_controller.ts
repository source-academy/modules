import { type IOptions, runECEvaluatorByJoel } from 'js-slang';
import context from 'js-slang/context';

export class ProgramController {
  #code: string;
  #iterator: Generator | null;

  constructor() {
    this.#code = '';
    this.#iterator = null;
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
    this.#iterator = runECEvaluatorByJoel(code, context, options);
  }

  step(_: number) {
    return this.#iterator!.next();
  }
}
