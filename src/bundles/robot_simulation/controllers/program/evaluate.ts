import type * as es from 'estree';
import * as _ from 'lodash';

import { type IOptions } from 'js-slang/dist';
import {
  is_null,
} from 'js-slang/dist/stdlib/list';
import { Variant, type Context, type RecursivePartial } from 'js-slang/dist/types';
import { Agenda, cmdEvaluators, Stash } from 'js-slang/dist/ec-evaluator/interpreter';
import { ECError } from 'js-slang/dist/ec-evaluator/types';
import { isNode } from 'js-slang/dist/ec-evaluator/utils';
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


export function* runECEvaluatorByJoel(
  code: string,
  context: Context,
  options: RecursivePartial<IOptions>,
): Generator<number, void, undefined> {
  const theOptions = _.merge({ ...DEFAULT_SOURCE_OPTIONS }, options);
  const program = parse(code, context);
  is_null(null);

  if (!program) {
    return;
  }

  yield* evaluateByJoel(program, context, theOptions);
}

/**
 * Function to be called when a program is to be interpreted using
 * the explicit control evaluator.
 *
 * @param program The program to evaluate.
 * @param context The context to evaluate the program in.
 * @returns The result of running the ECE machine.
 */
export function* evaluateByJoel(
  program: es.Program,
  context: Context,
  options: IOptions,
): Generator<number, any, undefined> {
  try {
    context.runtime.isRunning = true;
    context.runtime.agenda = new Agenda(program);
    context.runtime.stash = new Stash();
    yield* runECEMachineByJoel(
      context,
      context.runtime.agenda,
      context.runtime.stash,
      options.envSteps,
      options.stepLimit,
      options.isPrelude,
    );
  } catch (error) {
    // console.error('ecerror:', error)
    return new ECError(error);
  } finally {
    context.runtime.isRunning = false;
  }
}

function* runECEMachineByJoel(
  context: Context,
  agenda: Agenda,
  stash: Stash,
  envSteps: number,
  stepLimit: number,
  isPrelude: boolean = false,
) {
  context.runtime.break = false;
  context.runtime.nodes = [];
  let steps = 1;

  let command = agenda.peek();

  // First node will be a Program
  context.runtime.nodes.unshift(command as es.Program);

  while (command) {
    // Return to capture a snapshot of the agenda and stash after the target step count is reached
    if (!isPrelude && steps === envSteps) {
      return stash.peek();
    }
    // Step limit reached, stop further evaluation
    if (!isPrelude && steps === stepLimit) {
      break;
    }

    if (isNode(command) && command.type === 'DebuggerStatement') {
      // steps += 1

      // Record debugger step if running for the first time
      if (envSteps === -1) {
        context.runtime.breakpointSteps.push(steps);
      }
    }

    agenda.pop();
    if (isNode(command)) {
      context.runtime.nodes.shift();
      context.runtime.nodes.unshift(command);
      cmdEvaluators[command.type](command, context, agenda, stash, isPrelude);
      if (context.runtime.break && context.runtime.debuggerOn) {
        // We can put this under isNode since context.runtime.break
        // will only be updated after a debugger statement and so we will
        // run into a node immediately after.
        // With the new evaluator, we don't return a break
        // return new ECEBreak()
      }
    } else {
      // Command is an instrucion
      cmdEvaluators[command.instrType](command, context, agenda, stash, isPrelude);
    }

    // Push undefined into the stack if both agenda and stash is empty
    if (agenda.isEmpty() && stash.isEmpty()) {
      stash.push(undefined);
    }
    command = agenda.peek();
    yield steps;
    steps += 1;
  }

  if (!isPrelude) {
    context.runtime.envStepsTotal = steps;
  }
  return stash.peek();
}
