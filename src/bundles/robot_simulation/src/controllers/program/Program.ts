import { EvaluatorRuntimeError } from '@sourceacademy/conductor/common';
import type { DeepPartial } from '@sourceacademy/modules-lib/types';
import type { Context as PyContext } from '@sourceacademy/py-slang';
import { CallbackHandler } from '../../engine/Core/CallbackHandler';
import type { Controller } from '../../engine/Core/Controller';
import type { PhysicsTimingInfo } from '../../engine/Physics';
import { mergeConfig } from '../utils/mergeConfig';
import { ProgramError } from './error';
import { runPythonECEvaluator } from './evaluate';

type ProgramConfig = {
  stepsPerTick: number;
};

const defaultProgramConfig: ProgramConfig = {
  stepsPerTick: 11,
};

export const program_controller_identifier = 'program_controller';

/**
 * The robot's control program is Python only, evaluated with py-slang's CSE machine - see
 * {@link createPythonCSE} (index.ts) and controllers/program/pythonRuntime.ts, which builds the
 * py-slang `Context` this class steps.
 *
 * A Source-flavoured control program (what a `createCSE` would produce, re-using js-slang's own
 * CSE machine the same way) is a known, deliberately deferred follow-up, not attempted in this
 * migration: buildtools applies `external: ['js-slang*']` to every bundle build unconditionally
 * (lib/buildtools/src/build/modules/commons.ts), so *any* `js-slang/...` import anywhere in this
 * bundle - even one merely imported but never called - compiles down to a top-level
 * `require('js-slang/...')` that Conductor's runner Worker has no reason to be able to resolve
 * (that require only ever worked pre-migration because js-slang's own module loader
 * (`requireProvider.js`) was the thing running this bundle in the first place - see this class's
 * git history for the fuller version of that story). Building a full js-slang `Context` by hand
 * well enough to import it safely (chapter/prelude/global-environment setup, not just a flat
 * builtins map the way py-slang's `Context` allows) is real, un-derisked work of its own.
 */
export class Program implements Controller {
  code: string;
  pyContext: PyContext;
  iterator: ReturnType<typeof runPythonECEvaluator> | null;
  /** Guards against a new tick's pump starting before the previous tick's `await`ed steps have
   * all landed. `fixedUpdate` is a synchronous callback (see Controller.ts / World.ts), so it
   * cannot itself `await` — it kicks off a pump and returns immediately, and this flag stops a
   * second pump from overlapping the first if steps ever take longer than one physics tick to
    resolve (e.g. a slow native/module call). */
  private pumpBusy = false;
  /** Set by the async pump if a step throws. Since the pump is fire-and-forget (fixedUpdate can't
   * await it), the error can't be thrown synchronously from the tick that caused it — it's
   * stashed here and re-thrown from the *next* `fixedUpdate` call instead, so it still surfaces
    to (and is convertible by) the same call site a synchronous evaluator would throw from. */
  private pendingError: unknown = null;
  isPaused: boolean;
  callbackHandler = new CallbackHandler();
  name: string;
  config: ProgramConfig;

  constructor(
    code: string,
    config?: DeepPartial<ProgramConfig>,
    pyContext?: PyContext
  ) {
    if (pyContext === undefined) {
      throw new EvaluatorRuntimeError('Program: pyContext is required');
    }
    this.config = mergeConfig(defaultProgramConfig, config);
    this.name = program_controller_identifier;
    this.code = code;
    this.pyContext = pyContext;
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
    this.iterator = runPythonECEvaluator(this.code, this.pyContext, {
      stepLimit: -1,
    });
  }

  /**
   * Steps py-slang's async CSE-machine generator `stepsPerTick` times. Since `fixedUpdate` itself
   * must stay synchronous (it's called synchronously from the physics tick loop — see
   * World.ts/Controller.ts), this fires an async pump and returns immediately rather than
   * blocking on it. `pumpBusy` prevents a second tick's pump from overlapping the first's
   * still-in-flight `await`s.
   */
  fixedUpdate() {
    if (this.isPaused) {
      return;
    }

    if (this.pendingError !== null) {
      const error = this.pendingError;
      this.pendingError = null;
      console.error(error);
      throw new ProgramError('Error in program execution. Please check your code and try again.',);
    }

    if (!this.iterator) {
      throw new EvaluatorRuntimeError('Program not started');
    }
    if (this.pumpBusy) {
      // Previous tick's steps haven't all resolved yet; skip this tick rather than
      // interleaving two concurrent pumps against the same generator.
      return;
    }

    const iterator = this.iterator;
    const stepsPerTick = this.config.stepsPerTick;
    this.pumpBusy = true;
    (async () => {
      try {
        for (let i = 0; i < stepsPerTick; i++) {
          const { done } = await iterator.next();
          if (done) break;
        }
      } catch (e) {
        // Fire-and-forget: this pump isn't awaited by fixedUpdate, so the error can't be
        // thrown synchronously here — stash it for the next fixedUpdate call to raise.
        this.pendingError = e;
      } finally {
        this.pumpBusy = false;
      }
    })();
  }

  update(frameTiming: PhysicsTimingInfo): void {
    this.callbackHandler.checkCallbacks(frameTiming);
  }
}
