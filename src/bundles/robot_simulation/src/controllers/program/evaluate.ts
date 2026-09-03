import { merge } from 'es-toolkit';
import {
  Control,
  Stash,
  generateCSEMachineStateStream,
} from 'js-slang/dist/cse-machine/interpreter';
import type { Variant } from 'js-slang/dist/langs';
import { parse } from 'js-slang/dist/parser/parser';
import type { Context } from 'js-slang/dist/types';
import {
  analyze as analyzePython,
  Context as PyContext,
  Control as PyControl,
  generateCSEMachineStateStream as generatePyCSEMachineStateStream,
  parse as parsePython,
  Stash as PyStash,
} from '@sourceacademy/py-slang';

export const DEFAULT_SOURCE_OPTIONS = {
  scheduler: 'async',
  steps: 1000,
  stepLimit: -1,
  executionMethod: 'auto',
  // Literal rather than `Variant.DEFAULT`: the frontend satisfies this bundle's `js-slang/*`
  // imports at runtime through js-slang's own requireProvider allowlist
  // (js-slang/dist/modules/loader/requireProvider.js), which exposes createContext, cse-machine,
  // errors, parser, stdlib, types and utils - but NOT `langs`. A value import of
  // 'js-slang/dist/langs' therefore makes the whole bundle fail to load in the real frontend with
  // "Dynamic require of js-slang/dist/langs is not supported", before any user code runs. The
  // type-only import above is erased at build time and so is safe.
  variant: 'default' as Variant,
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
  options: any
): Generator<{ steps: number }, void, undefined> {
  const theOptions = merge({ ...DEFAULT_SOURCE_OPTIONS }, options);
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
      theOptions.isPrelude
    );
    // eslint-disable-next-line no-useless-catch
  } catch (error) {
    throw error;
  } finally {
    context.runtime.isRunning = false;
  }
}

export const DEFAULT_PYTHON_OPTIONS = {
  variant: 4,
  stepLimit: -1,
  recursionLimit: 1024,
  isPrelude: false,
};

/**
 * Python-flavoured counterpart of {@link runECEvaluator}, driving py-slang's CSE machine
 * instead of js-slang's. Mirrors the same "parse -> analyze -> new Control/Stash -> step the
 * generator" sequence that py-slang's own PyCseEvaluator (src/conductor/PyCseEvaluator.ts,
 * upstream in the py-slang repo) uses internally, except the generator here is stepped one
 * tick's worth of steps at a time (via {@link Program.fixedUpdate}) instead of being drained to
 * completion in one go.
 *
 * Unlike {@link runECEvaluator} (a *sync* generator, since js-slang's
 * generateCSEMachineStateStream is `function*`), py-slang's generateCSEMachineStateStream is an
 * `async function*` — every step requires an `await`. Callers must drive this with
 * `for await`/manual `await iterator.next()`, never a bare `.next()`.
 *
 * The `context` here is a py-slang `Context`, entirely distinct from js-slang's `Context` used by
 * `runECEvaluator` — it is NOT sourced from any 'js-slang/context'-style runtime injection (no such
 * convention exists for py-slang). It is built by this bundle itself, in pythonRuntime.ts's
 * `createRobotPythonContext()`, which seeds it with the SICPy builtins plus the `ev3_*` robot API;
 * `createPythonCSE()` in helper_functions.ts is the caller that puts the two together.
 */
export async function* runPythonECEvaluator(
  code: string,
  context: PyContext,
  options: Partial<typeof DEFAULT_PYTHON_OPTIONS> = {}
): AsyncGenerator<{ steps: number }, void, undefined> {
  const theOptions = merge({ ...DEFAULT_PYTHON_OPTIONS }, options);
  const script = code + '\n';
  const ast = parsePython(script);

  // `preludeNames` seeds the resolver's *root builtins* environment, so every name the machine
  // can actually resolve at runtime must appear here or the program fails analysis with a
  // NameError before a single step runs. Runtime lookup (pyGetVariable in py-slang's
  // engines/cse/utils.ts) falls back to `nativeStorage.builtins` after walking the environment
  // chain, so the two sources below are exactly the two places a name can come from:
  // the builtins registered on the context (see pythonRuntime.ts - SICPy primitives plus the
  // ev3_* robot API) and anything already bound in the global environment.
  const errors = analyzePython(
    ast,
    script,
    theOptions.variant,
    [],
    [
      ...context.nativeStorage.builtins.keys(),
      ...Object.keys(context.runtime.environments[0]?.head ?? {}),
    ]
  );
  if (errors.length > 0) {
    throw errors;
  }

  const control = new PyControl(ast);
  const stash = new PyStash();
  context.control = control;
  context.stash = stash;

  yield* generatePyCSEMachineStateStream(
    script,
    context,
    control,
    stash,
    theOptions.stepLimit,
    theOptions.recursionLimit,
    theOptions.variant,
    theOptions.isPrelude
  );
}
