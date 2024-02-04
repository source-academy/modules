import type * as es from 'estree';

import {
  cmdEvaluators,
  type Agenda,
  type Stash,
} from 'js-slang/dist/ec-evaluator/interpreter';
import { type Context } from 'js-slang';

import { isNode } from 'js-slang/dist/ec-evaluator/utils';

export function* runECEMachineByJoel(
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
      cmdEvaluators[command.instrType](
        command,
        context,
        agenda,
        stash,
        isPrelude,
      );
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
