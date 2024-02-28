import * as _ from 'lodash';

import { type IOptions } from 'js-slang/dist';

import { Variant, type Context, type RecursivePartial } from 'js-slang/dist/types';
import { Control, Stash, generateCSEMachineStateStream } from 'js-slang/dist/cse-machine/interpreter';
import { parse } from 'js-slang/dist/parser/parser';

const DEFAULT_SOURCE_OPTIONS = {
  scheduler: 'async',
  steps: 1000,
  stepLimit: -1,
  executionMethod: 'auto',
  variant: Variant.DEFAULT,
  originalMaxExecTime: 1000,
  useSubst: false,
  isPrelude: false,
  throwInfiniteLoops: true,
  envSteps: -1,
  importOptions: {
    wrapSourceModules: true,
    checkImports: true,
    loadTabs: true,
  },
};


export function* runECEvaluator(
  code: string,
  context: Context,
  options: RecursivePartial<IOptions>,
): Generator<{ steps: number }, void, undefined> {
  const theOptions = _.merge({ ...DEFAULT_SOURCE_OPTIONS }, options);
  const program = parse(code, context);

  if (!program) {
    return;
  }

  try {
    context.runtime.isRunning = true;
    context.runtime.control = new Control(program);
    context.runtime.stash = new Stash();
    yield* generateCSEMachineStateStream(
      context,
      context.runtime.control,
      context.runtime.stash,
      theOptions.envSteps,
      theOptions.stepLimit,
      theOptions.isPrelude,
    );
  // eslint-disable-next-line no-useless-catch
  } catch (error) {
    throw error;
  } finally {
    context.runtime.isRunning = false;
  }
}
