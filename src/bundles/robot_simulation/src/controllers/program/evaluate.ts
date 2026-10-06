import {
  Context as PyContext,
  Control as PyControl,
  Stash as PyStash,
  analyze as analyzePython,
  generateCSEMachineStateStream as generatePyCSEMachineStateStream,
  parse as parsePython,
} from '@sourceacademy/py-slang';
import { merge } from 'es-toolkit';

export const DEFAULT_PYTHON_OPTIONS = {
  variant: 4,
  stepLimit: -1,
  recursionLimit: 1024,
  isPrelude: false,
};

/**
 * Drives py-slang's CSE machine one tick's worth of steps at a time (via
 * {@link Program.fixedUpdate}) instead of draining it to completion in one go. Mirrors the same
 * "parse -> analyze -> new Control/Stash -> step the generator" sequence py-slang's own
 * PyCseEvaluator (upstream in the py-slang repo) uses internally.
 *
 * py-slang's generateCSEMachineStateStream is an `async function*` - every step requires an
 * `await`. Callers must drive this with `for await`/manual `await iterator.next()`, never a bare
 * `.next()`.
 *
 * `@sourceacademy/py-slang` is an ordinary bundled dependency (unlike `js-slang`, which
 * buildtools always excludes from the bundle via esbuild's `external: ['js-slang*']` - see
 * Program.ts's doc comment for why that rules out a js-slang-based sibling of this function for
 * now), so everything here loads the same way inside Conductor's runner Worker as any other
 * library code this bundle uses.
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
