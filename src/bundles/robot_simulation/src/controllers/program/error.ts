/**
 * Thrown internally by `Program.fixedUpdate()`/caught by `World.step()` - never crosses the
 * Conductor evaluator boundary itself, so it doesn't need to be one of `@sourceacademy/conductor/
 * common`'s evaluator error types. It used to extend `@sourceacademy/modules-lib/errors`'
 * `RuntimeSourceError`, which itself imports real `js-slang/dist/errors/*` code - harmless
 * pre-migration (this bundle was always hosted by js-slang's own module loader, which resolves
 * those `js-slang/...` requires), but fatal now: esbuild's blanket `external: ['js-slang*']` rule
 * (lib/buildtools/src/build/modules/commons.ts) means that import compiles to a top-level
 * `require('js-slang/dist/errors/base')` baked into this bundle, which Conductor's runner Worker
 * has no reason to be able to resolve. A plain `Error` subclass is all this actually needs.
 */
export class ProgramError extends Error {
  constructor(public readonly explanation: string) {
    super(explanation);
    this.name = 'ProgramError';
  }
}
