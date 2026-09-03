import { GeneralRuntimeError } from '@sourceacademy/modules-lib/errors';
import type { DeepPartial } from '@sourceacademy/modules-lib/types';
import type { Context as PyContext } from '@sourceacademy/py-slang';
import type { IOptions } from 'js-slang';
import context from 'js-slang/context';
import { CallbackHandler } from '../../engine/Core/CallbackHandler';
import type { Controller } from '../../engine/Core/Controller';
import type { PhysicsTimingInfo } from '../../engine/Physics';
import { mergeConfig } from '../utils/mergeConfig';
import { ProgramError } from './error';
import { runECEvaluator, runPythonECEvaluator } from './evaluate';

type ProgramConfig = {
  stepsPerTick: number;
};

const defaultProgramConfig: ProgramConfig = {
  stepsPerTick: 11,
};

export const program_controller_identifier = 'program_controller';

/**
 * Which language flavour a Program should evaluate its code with.
 *
 * `'source'` is what {@link createCSE} produces: the surrounding Source program is re-run as the
 * robot's control program, using the js-slang `Context` the host frontend injects into this bundle
 * via the esbuild `external: ['js-slang*']` rule (see
 * modules/lib/buildtools/src/build/modules/commons.ts).
 *
 * `'python'` is what {@link createPythonCSE} produces. There is no 'py-slang/context'-style
 * runtime-injection convention anywhere in this codebase — buildtools' external list is still just
 * `js-slang*` — so nothing hands this bundle a py-slang `Context`. It therefore builds its own; see
 * controllers/program/pythonRuntime.ts, which also explains why a Python program running under
 * py-slang's own conductor evaluator cannot simply `import robot_simulation` instead.
 */
export type ProgramLanguage = 'source' | 'python';

export class Program implements Controller {
  code: string;
  language: ProgramLanguage;
  /** Only used when `language === 'python'`. The py-slang `Context` this Program's shadow
   * evaluation runs against — entirely separate from js-slang's `context` singleton above. */
  pyContext: PyContext | null;
  iterator: ReturnType<typeof runECEvaluator> | null;
  /** Only used when `language === 'python'`; `runECEvaluator`'s async counterpart. */
  pyIterator: ReturnType<typeof runPythonECEvaluator> | null;
  /** Guards against a new tick's pump starting before the previous tick's `await`ed steps have
   * all landed. Needed only for the Python path: `fixedUpdate` is a synchronous callback (see
   * Controller.ts / World.ts), so it cannot itself `await` — it kicks off a pump and returns
   * immediately, and this flag stops a second pump from overlapping the first if steps ever take
   * longer than one physics tick to resolve (e.g. a slow native/module call). */
  private pythonPumpBusy = false;
  /** Set by `fixedUpdatePython`'s async pump if a step throws. Since the pump is fire-and-forget
   * (fixedUpdate can't await it), the error can't be thrown synchronously from the tick that
   * caused it — it's stashed here and re-thrown from the *next* `fixedUpdate` call instead, so it
   * still surfaces to (and is convertible by) the same call site the sync path throws from. */
  private pythonError: unknown = null;
  isPaused: boolean;
  callbackHandler = new CallbackHandler();
  name: string;
  config: ProgramConfig;

  constructor(
    code: string,
    config?: DeepPartial<ProgramConfig>,
    language: ProgramLanguage = 'source',
    pyContext: PyContext | null = null
  ) {
    this.config = mergeConfig(defaultProgramConfig, config);
    this.name = program_controller_identifier;
    this.code = code;
    this.language = language;
    this.pyContext = pyContext;
    this.iterator = null;
    this.pyIterator = null;
    this.isPaused = false;

    if (this.language === 'python' && this.pyContext === null) {
      throw new GeneralRuntimeError('Program: pyContext is required when language is "python"');
    }
  }

  pause(pauseDuration: number) {
    this.isPaused = true;
    this.callbackHandler.addCallback(() => {
      this.isPaused = false;
    }, pauseDuration);
  }

  start() {
    if (this.language === 'python') {
      this.pyIterator = runPythonECEvaluator(this.code, this.pyContext!, {
        stepLimit: -1,
      });
      return;
    }

    const options: Partial<IOptions> = {
      originalMaxExecTime: Infinity,
      stepLimit: Infinity,
      throwInfiniteLoops: false,
      useSubst: false,
    };

    context.errors = [];

    this.iterator = runECEvaluator(this.code, context, options);
  }

  fixedUpdate() {
    if (this.isPaused) {
      return;
    }

    if (this.language === 'python') {
      this.fixedUpdatePython();
      return;
    }

    try {
      if (!this.iterator) {
        throw new GeneralRuntimeError('Program not started');
      }

      // steps per tick
      for (let i = 0; i < this.config.stepsPerTick; i++) {
        this.iterator.next();
      }
    } catch (e) {
      console.error(e);
      throw new ProgramError('Error in program execution. Please check your code and try again.',);
    }
  }

  /**
   * Steps py-slang's async CSE-machine generator `stepsPerTick` times. Since `fixedUpdate` itself
   * must stay synchronous (it's called synchronously from the physics tick loop — see
   * World.ts/Controller.ts), this fires an async pump and returns immediately rather than
   * blocking on it. `pythonPumpBusy` prevents a second tick's pump from overlapping the first's
   * still-in-flight `await`s.
   */
  private fixedUpdatePython() {
    if (this.pythonError !== null) {
      const error = this.pythonError;
      this.pythonError = null;
      console.error(error);
      throw new ProgramError('Error in program execution. Please check your code and try again.',);
    }

    if (!this.pyIterator) {
      throw new GeneralRuntimeError('Program not started');
    }
    if (this.pythonPumpBusy) {
      // Previous tick's steps haven't all resolved yet; skip this tick rather than
      // interleaving two concurrent pumps against the same generator.
      return;
    }

    const iterator = this.pyIterator;
    const stepsPerTick = this.config.stepsPerTick;
    this.pythonPumpBusy = true;
    (async () => {
      try {
        for (let i = 0; i < stepsPerTick; i++) {
          const { done } = await iterator.next();
          if (done) break;
        }
      } catch (e) {
        // Fire-and-forget: this pump isn't awaited by fixedUpdate, so the error can't be
        // thrown synchronously here — stash it for the next fixedUpdatePython call to raise.
        this.pythonError = e;
      } finally {
        this.pythonPumpBusy = false;
      }
    })();
  }

  update(frameTiming: PhysicsTimingInfo): void {
    this.callbackHandler.checkCallbacks(frameTiming);
  }
}
